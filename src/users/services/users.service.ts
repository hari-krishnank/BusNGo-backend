import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { IUser } from "../interfaces/user.interface";
import { OtpService } from "./otp.service";
import { VerifyOtpDto } from "../dto/verifyOtp.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { IUserDocument } from "../interfaces/user-document.interface";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { EmailTemplates } from "src/utils/email-templates";

@Injectable()
export class UsersService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly usersRepository: UsersRepository, private readonly otpService: OtpService, private readonly configService: ConfigService) {
        const emailUser = this.configService.get<string>('email.user');
        const emailPass = this.configService.get<string>('email.pass');

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: true, 
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
    }

    async initiateRegistration(userData: CreateUserDto): Promise<void> {
        const existingUser = await this.usersRepository.findByEmail(userData.email);
        if (existingUser && existingUser.is_verified) {
            throw new BadRequestException('Email already registered');
        }

        const unverifiedUserData: IUser = { ...userData, is_verified: false, is_blocked: false };

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
                const latest = await this.usersRepository.create({ ...user, is_verified: true, is_blocked: false });
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

    async forgotPassword(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        console.log('Reset token:', resetToken);

        const resetTokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        const userId = user._id as string;

        await this.usersRepository.updateResetToken(userId, resetToken, resetTokenExpiration);

        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
        console.log('Reset URL:', resetUrl);

        const mailOptions = {
            from: this.configService.get('email.user'),
            to: user.email,
            subject: 'BusNGo Password Reset',
            html: EmailTemplates.getPasswordResetTemplate(resetUrl, user.email, this.configService)
        };
        await this.transporter.sendMail(mailOptions);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.usersRepository.findByResetToken(token);
        if (!user) {
            throw new BadRequestException('Invalid or expired password reset token');
        }

        if (user.resetTokenExpiration < new Date()) {
            throw new BadRequestException('Password reset token has expired');
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();
    }

    async updateWalletBalance(userId: string, amount: number): Promise<IUserDocument> {
        const user = await this.findById(userId);
        user.walletBalance += amount;
        return user.save();
    }
}