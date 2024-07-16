import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '../schemas/otp.schema';
import { IOtpDocument } from '../interfaces/otp-doucument.interface';

@Injectable()
export class OtpRepository {
    constructor(@InjectModel(Otp.name) private readonly otpModel: Model<IOtpDocument>) { }

    async create(otpData: Partial<Otp>): Promise<IOtpDocument> {
        const otp = new this.otpModel({
            ...otpData,
            createdAt: new Date(),
        });
        return otp.save();
    }

    async findByEmail(email: string): Promise<IOtpDocument | null> {
        return this.otpModel.findOne({ email }).exec();
    }


    async deleteByEmail(email: string): Promise<void> {
        await this.otpModel.deleteOne({ email }).exec();
    }
    
    async deleteExpired(): Promise<{ deletedCount: number }> {
        const result = await this.otpModel.deleteMany({ expiresAt: { $lt: new Date() } }).exec();
        return { deletedCount: result.deletedCount };
    }

    
}