import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { IUser } from "../interfaces/user.interface";
import { OtpService } from "./otp.service";
import { VerifyOtpDto } from "../dto/verifyOtp.dto";
import { IUserDocument } from "../interfaces/user-document.interface";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UsersService {
    private pendingUsers: Map<string, CreateUserDto> = new Map();

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly otpService: OtpService,
    ) { }

    async initiateRegistration(userData: CreateUserDto): Promise<void> {
        const existingUser = await this.usersRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }
        const otp = await this.otpService.generateOTP();
        await this.otpService.sendOTP(userData.email, otp);
        this.pendingUsers.set(userData.email, userData);
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<IUserDocument> {
        const { email, otp } = verifyOtpDto;
        const valid = await this.otpService.verifyOtp(email, otp);
        if (!valid) {
            throw new BadRequestException('Invalid OTP');
        }

        const userData = this.pendingUsers.get(email);
        if (!userData) {
            throw new BadRequestException('User data not found');
        }

        const user: IUser = {
            ...userData,
            is_verified: true,
        };

        this.pendingUsers.delete(email);
        return this.usersRepository.create(user);
    }


    async findByEmail(email: string) {
        return this.usersRepository.findByEmail(email)
    }
}