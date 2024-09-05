import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { IUser } from "../interfaces/user.interface";
import { OtpService } from "./otp.service";
import { VerifyOtpDto } from "../dto/verifyOtp.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { IUserDocument } from "../interfaces/user-document.interface";

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly otpService: OtpService,
    ) { }

    async initiateRegistration(userData: CreateUserDto): Promise<void> {
        const existingUser = await this.usersRepository.findByEmail(userData.email);
        if (existingUser && existingUser.is_verified) {
            throw new BadRequestException('Email already registered');
        }

        const unverifiedUserData: IUser = {
            ...userData,
            is_verified: false,
            is_blocked: false
        };

        await this.usersRepository.createUnverifiedUser(unverifiedUserData);

        const otp = await this.otpService.generateOTP();
        await this.otpService.sendOTP(userData.email, otp);
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
        const { email, otp } = verifyOtpDto;
        const isValid = await this.otpService.verifyOtp(email, otp);

        if (isValid) {
            const unverifiedUser = await this.usersRepository.findUnverifiedByEmail(email);
            if (unverifiedUser) {
                const user = unverifiedUser.toObject();
                delete user._id;
                const latest = await this.usersRepository.create({
                    ...user,
                    is_verified: true,
                    is_blocked: false
                });
                console.log(latest);

                await this.usersRepository.deleteUnverifiedByEmail(email);
                return true;
            }
        }
        return false;
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findById(id: string) {
        return this.usersRepository.findById(id);
    }

    async isUserBlocked(userId: string): Promise<boolean> {
        const user = await this.findById(userId);
        console.log(user);
        return user ? user.is_blocked : false;
    }
}