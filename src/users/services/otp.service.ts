import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { OtpRepository } from '../repositories/otp.repository';

@Injectable()
export class OtpService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly otpRepository: OtpRepository) {

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            auth: {
                user: 'hkharikrishnan111@gmail.com',
                pass: 'fcla dstr shiu uboi',
            },
        });

    }

    async generateOTP(): Promise<number> {
        return Math.floor(10000 + Math.random() * 90000);
    }

    async sendOTP(email: string, otp: number): Promise<void> {
        const mailOptions = {
            from: 'hkharikrishnan111@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
            html: `<b>Your OTP code is ${otp}</b>`,
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
}
