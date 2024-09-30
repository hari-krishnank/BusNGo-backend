import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Staffs } from "../schemas/staff.schema";
import { Model, Types } from "mongoose";
import { CreateStaffDto } from "../dto/create-staff.dto";
import { Staff } from "../interfaces/staff.interface";
import { generateRandomPassword } from "src/utils/password-generator";
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StaffService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(StaffService.name);

    constructor(
        @InjectModel(Staffs.name) private staffModel: Model<Staffs>,
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

    async create(createStaffDto: CreateStaffDto, ownerId: string): Promise<Staff> {
        const existingStaff = await this.staffModel.findOne({ email: createStaffDto.email }).exec();
        if (existingStaff) {
            throw new ConflictException('Email already in use');
        }

        const rawPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const createdStaff = new this.staffModel({
            ...createStaffDto,
            password: hashedPassword,
            ownerId: new Types.ObjectId(ownerId),
            bus: new Types.ObjectId(createStaffDto.bus)
        });

        const savedStaff = await createdStaff.save();

        await this.sendCredentialsEmail(savedStaff.email, savedStaff.username, rawPassword);

        const { password, ...staffWithoutPassword } = savedStaff.toJSON();
        return staffWithoutPassword;
    }

    private async sendCredentialsEmail(email: string, username: string, password: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        const staffLoginUrl = `${frontendUrl}/staffHome`;
        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: email,
            subject: 'Your Staff Account Credentials',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f7f9; border-radius: 10px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Your Staff Account Credentials</h1>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 18px; color: #555; margin-bottom: 20px;">Hello ${username},</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">Your staff account has been created. Here are your login credentials:</p>
            <p style="font-size: 16px; color: #555;"><strong>Username:</strong> ${username}</p>
            <p style="font-size: 16px; color: #555;"><strong>Password:</strong> ${password}</p>
            <p style="font-size: 16px; color: #555;"><strong>Login URL:</strong> <a href="${staffLoginUrl}">${staffLoginUrl}</a></p>
            <p style="font-size: 14px; color: #888; margin-top: 20px;">Please change your password after your first login.</p>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
            If you didn't expect this email, please contact the administrator.
          </p>
        </div>`};

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Credentials sent to ${email}`);
        } catch (error) {
            console.error('Error sending credentials email:', error);
            throw new Error('Failed to send credentials email');
        }
    }

    async validateStaff(email: string, password: string) {
        const staff = await this.staffModel.findOne({ email }).exec();
        if (!staff) {
            this.logger.warn(`Staff not found for email: ${email}`);
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, staff.password);
        if (!passwordMatch) {
            this.logger.warn(`Invalid password for email: ${email}`);
            return null;
        }
        return staff;
    }

    async getStaffsByOwnerId(ownerId: string): Promise<Staff[]> {
        return this.staffModel.find({ ownerId: new Types.ObjectId(ownerId) }).populate('bus', 'name').exec();
    }
}