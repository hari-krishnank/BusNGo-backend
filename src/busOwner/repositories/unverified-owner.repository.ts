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

    async create(ownerData: IOwner): Promise<IOwnerDocument> {
        const newOwner = new this.verifiedOwnerModel(ownerData);
        return newOwner.save();
    }

    async createVerifiedOwner(ownerData: IOwner): Promise<IOwnerDocument> {
        const newVerifiedOwner = new this.verifiedOwnerModel(ownerData);
        return newVerifiedOwner.save();
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
            await this.unverifiedOwnerModel.deleteMany({ email });
        } catch (error) {
            console.error('Error deleting unverified owner:', error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<IOwner | null> {
        let owner = await this.unverifiedOwnerModel.findOne({ email }).exec();

        if (!owner) {
            owner = await this.verifiedOwnerModel.findOne({ email }).exec();
        }

        return owner;
    }

    async updateUnverifiedOwner(updateOwnerDetailsDto: UpdateOwnerDetailsDto): Promise<IOwnerDocument | null> {
        const updateData: Partial<IOwner> = {};
        if (updateOwnerDetailsDto.firstName) updateData.firstName = updateOwnerDetailsDto.firstName;
        if (updateOwnerDetailsDto.lastName) updateData.lastName = updateOwnerDetailsDto.lastName;
        if (updateOwnerDetailsDto.mobile) updateData.mobile = updateOwnerDetailsDto.mobile;
        if (updateOwnerDetailsDto.password) updateData.password = updateOwnerDetailsDto.password;
        if (updateOwnerDetailsDto.agencyName) updateData.agencyName = updateOwnerDetailsDto.agencyName;
        if (updateOwnerDetailsDto.designation) updateData.designation = updateOwnerDetailsDto.designation;
        if (updateOwnerDetailsDto.country) updateData.country = updateOwnerDetailsDto.country;
        if (updateOwnerDetailsDto.state) updateData.state = updateOwnerDetailsDto.state;
        if (updateOwnerDetailsDto.city) updateData.city = updateOwnerDetailsDto.city;
        if (updateOwnerDetailsDto.postalCode) updateData.postalCode = updateOwnerDetailsDto.postalCode;
        if (updateOwnerDetailsDto.registeredAddress) updateData.registeredAddress = updateOwnerDetailsDto.registeredAddress;
        console.log(updateData);


        return this.unverifiedOwnerModel.findOneAndUpdate(
            { email: updateOwnerDetailsDto.email },
            updateData,
            { new: true }
        ).exec();
    }

    async getVerifiedOwners(): Promise<IVerifiedOwnerDocument[]> {
        return this.verifiedOwnerModel.find({ is_verified: true }).exec();
    }

    async updateOwnerBlockStatus(id: string, isBlocked: boolean): Promise<IVerifiedOwnerDocument> {
        return this.verifiedOwnerModel.findByIdAndUpdate(id, { is_blocked: isBlocked }, { new: true }).exec();
    }
}