import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { IUser } from "../interfaces/user.interface";
import { OtpService } from "./otp.service";
import { VerifyOtpDto } from "../dto/verifyOtp.dto";
import { CreateUserDto } from "../dto/create-user.dto";

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
                await this.usersRepository.create({
                    ...user,
                    is_verified: true,
                });
                await this.usersRepository.deleteUnverifiedByEmail(email);
                return true;
            }
        }
        return false;
    }
    

    async findByEmail(email: string) {
        return this.usersRepository.findByEmail(email)
    }
}