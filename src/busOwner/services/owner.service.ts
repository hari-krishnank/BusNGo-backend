import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { UnverifiedOwnerRepository } from "../repositories/unverified-owner.repository";
import { IOwner } from "../interfaces/owner.interface";
import { OtpService } from "src/users/services/otp.service";
import { VerifyOtpDto } from "src/users/dto/verifyOtp.dto";
import { UpdateOwnerDetailsDto } from "../dto/update-owner-details.dto";

@Injectable()
export class OwnerService {

    constructor(private ownerRepository: UnverifiedOwnerRepository, private otpService: OtpService) { }

    async initiateOwnerRegistration(ownerData: CreateOwnerDto): Promise<void> {
        const existingUser = await this.ownerRepository.findByEmail(ownerData.email);

        if (existingUser && existingUser.is_verified) {
            throw new BadRequestException('Email already registered');
        }

        if (existingUser && existingUser.registrationRequestSent) {
            if (existingUser.statusOfApproval === 'rejected') {
                throw new BadRequestException('Registration request denied. Please contact support for details.');
            }
            throw new BadRequestException('Registration request already sent and pending approval');
        }

        const unverifiedOwnerData: IOwner = {
            ...ownerData,
            is_verified: false,
            registrationRequestSent: false,
            statusOfApproval: 'pending'
        };

        if (existingUser && !existingUser.is_verified) {
            await this.ownerRepository.updateUnverifiedOwner({
                email: ownerData.email,
                ...unverifiedOwnerData
            });
        } else {
            await this.ownerRepository.createUnverifiedOwner(unverifiedOwnerData);
        }

        const otp = await this.otpService.generateOTP();
        await this.otpService.sendOTP(ownerData.email, otp);
    }


    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
        const { email, otp } = verifyOtpDto;
        const isValid = await this.otpService.verifyOtp(email, otp);

        if (isValid) {
            const unverifiedUser = await this.ownerRepository.findUnverifiedByEmail(email);
            if (unverifiedUser) {
                const user = unverifiedUser.toObject();
                delete user._id;
                await this.ownerRepository.create({
                    ...user,
                    is_verified: true,
                });
                await this.ownerRepository.deleteUnverifiedByEmail(email);
                return true;
            }
        }
        return false;
    }


    async updateOwnerDetails(updateOwnerDetailsDto: UpdateOwnerDetailsDto): Promise<void> {
        const existingUser = await this.ownerRepository.findUnverifiedByEmail(updateOwnerDetailsDto.email);
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }

        await this.ownerRepository.updateUnverifiedOwner(updateOwnerDetailsDto);
    }

    async getOwnerDetails(email: string): Promise<IOwner> {
        const owner = await this.ownerRepository.findByEmail(email)
        console.log('Owner Details :', owner);
        if (!owner) {
            throw new NotFoundException('Owner not found');
        }
        return owner;
    }

    async confirmOwnerDetails(email: string): Promise<boolean> {
        const unverifiedOwner = await this.ownerRepository.findUnverifiedByEmail(email);
        if (!unverifiedOwner) {
            throw new BadRequestException('Unverified owner not found');
        }

        await this.ownerRepository.updateUnverifiedOwner({
            ...unverifiedOwner.toObject(),
            registrationRequestSent: true,
        });

        return true;
    }

    async findById(id: string) {
        return this.ownerRepository.findById(id);
    }
}