import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { OtpRepository } from '../repositories/otp.repository';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OtpService {
    private transporter: nodemailer.Transporter;

    constructor(
        private readonly otpRepository: OtpRepository,
        private readonly configService: ConfigService
    ) {
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

    async generateOTP(): Promise<number> {
        return Math.floor(10000 + Math.random() * 90000);
    }

    async sendOTP(email: string, otp: number): Promise<void> {
        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
            html: 
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f9; border-radius: 10px;">
                <img src="" alt="" style="display: block; margin: 0 auto; max-width: 150px; margin-bottom: 20px;">
                <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Your OTP for BusNGo</h1>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <p style="font-size: 18px; color: #555; margin-bottom: 20px;">Your One-Time Password (OTP) is:</p>
                    <h2 style="font-size: 36px; color: #4a90e2; letter-spacing: 5px; margin-bottom: 20px;">${otp}</h2>
                    <p style="font-size: 14px; color: #888;">This OTP will expire in 1 minutes.</p>
                </div>
                <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
                    If you didn't request this OTP, please ignore this email.
                </p>
            </div>`,
        };

        await this.transporter.sendMail(mailOptions);
        console.log(`Sending OTP ${otp} to ${email}`);

        await this.saveOTP(email, otp);
    }

    async saveOTP(email: string, otp: number): Promise<void> {
        const existingOtp = await this.otpRepository.findByEmail(email);

        if (existingOtp) {
            await this.otpRepository.deleteByEmail(email);
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 1);
        await this.otpRepository.create({ email, otp, expiresAt });
    }

    async verifyOtp(email: string, otp: number): Promise<boolean> {
        const otpRecord = await this.otpRepository.findByEmail(email);
        if (!otpRecord) return false;
        if (otpRecord.otp === otp && otpRecord.expiresAt > new Date()) {
            await this.otpRepository.deleteByEmail(email);
            return true;
        }
        return false;
    }


    @Cron(CronExpression.EVERY_SECOND)
    async cleanupExpiredOtps() {
        try {
            const result = await this.otpRepository.deleteExpired();
        } catch (error) {
            console.error('Error cleaning up expired OTPs:', error);
        }
    }

    async resendOTP(email: string): Promise<void> {
        const existingOtp = await this.otpRepository.findByEmail(email);

        if (existingOtp && existingOtp.expiresAt > new Date()) {
            throw new Error('OTP is still valid. Please wait for it to expire before requesting a new one.');
        }

        const newOtp = await this.generateOTP();
        await this.sendOTP(email, newOtp);
    }
}