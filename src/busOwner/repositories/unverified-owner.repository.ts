import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOwner } from '../interfaces/owner.interface';
import { unverifiedOwner } from '../schemas/unverifiedOwner.schema';
import { IVerifiedOwnerDocument } from '../interfaces/owner.document';
import { IOwnerDocument } from '../interfaces/verifiedOwner.document';
import { verifiedOwner } from '../schemas/verifiedOwner.schema';
import { UpdateOwnerDetailsDto } from '../dto/update-owner-details.dto';

@Injectable()
export class UnverifiedOwnerRepository {
    constructor(
        @InjectModel(unverifiedOwner.name) private readonly unverifiedOwnerModel: Model<IOwnerDocument>,
        @InjectModel(verifiedOwner.name) private readonly verifiedOwnerModel: Model<IVerifiedOwnerDocument>,
    ) { }

    async create(userData: IOwner): Promise<IOwnerDocument> {
        const newUser = new this.verifiedOwnerModel(userData);
        return newUser.save();
    }

    async createUnverifiedOwner(ownerData: IOwner): Promise<IOwnerDocument> {
        const newUnverifiedOwner = new this.unverifiedOwnerModel(ownerData);
        return newUnverifiedOwner.save();
    }

    async findUnverifiedByEmail(email: string): Promise<IOwnerDocument | null> {
        return this.unverifiedOwnerModel.findOne({ email }).exec();
    }


    async deleteUnverifiedByEmail(email: string): Promise<void> {
        try {
            await this.unverifiedOwnerModel.deleteMany({ email }).exec();
        } catch (error) {
            throw new Error(`Error deleting unverified user by email: ${error.message}`);
        }
    }

    async findByEmail(email: string): Promise<IOwner | null> {
        return this.unverifiedOwnerModel.findOne({ email }).exec();
    }

    async updateUnverifiedOwner(updateOwnerDetailsDto: UpdateOwnerDetailsDto): Promise<IOwnerDocument | null> {
        const updateData: Partial<IOwner> = {};
        if (updateOwnerDetailsDto.firstName) updateData.firstName = updateOwnerDetailsDto.firstName;
        if (updateOwnerDetailsDto.lastName) updateData.lastName = updateOwnerDetailsDto.lastName;
        if (updateOwnerDetailsDto.mobile) updateData.mobile = updateOwnerDetailsDto.mobile;
        if (updateOwnerDetailsDto.password) updateData.password = updateOwnerDetailsDto.password;

        return this.unverifiedOwnerModel.findOneAndUpdate(
            { email: updateOwnerDetailsDto.email },
            updateData,
            { new: true }
        ).exec();
    }
}