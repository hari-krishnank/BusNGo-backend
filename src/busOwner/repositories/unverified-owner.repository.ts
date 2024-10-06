import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOwner } from '../interfaces/owner.interface';
import { unverifiedOwner } from '../schemas/unverifiedOwner.schema';
import { IVerifiedOwnerDocument } from '../interfaces/owner.document';
import { IOwnerDocument } from '../interfaces/verifiedOwner.document';
import { verifiedOwner } from '../schemas/verifiedOwner.schema';

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
            throw error;
        }
    }

    async findByEmail(email: string): Promise<IOwner | null> {
        let owner = await this.unverifiedOwnerModel.findOne({ email }).exec();

        if (!owner) {
            owner = await this.verifiedOwnerModel.findOne({ email }).exec();
        }
        console.log(owner.email);

        return owner;
    }

    async updateUnverifiedOwner(ownerData: IOwner): Promise<IOwnerDocument> {
        const filter = { email: ownerData.email };
        const update = { ...ownerData };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        return this.unverifiedOwnerModel.findOneAndUpdate(filter, update, options).exec();
    }

    async getVerifiedOwners(skip: number, limit: number): Promise<{ owners: any[], total: number }> {
        const [owners, total] = await Promise.all([
            this.verifiedOwnerModel.find({ is_verified: true }).skip(skip).limit(limit).exec(),
            this.verifiedOwnerModel.countDocuments()
        ]);
        return { owners, total }
    }

    async updateOwnerBlockStatus(id: string, isBlocked: boolean): Promise<IVerifiedOwnerDocument> {
        return this.verifiedOwnerModel.findByIdAndUpdate(id, { is_blocked: isBlocked }, { new: true }).exec();
    }

    async findById(id: string): Promise<IVerifiedOwnerDocument | null> {
        return this.verifiedOwnerModel.findById(id).exec();
    }

    async getOwnerRegistrationRequests(skip: number, limit: number): Promise<{ owners: IOwnerDocument[], total: number }> {
        const [owners, total] = await Promise.all([
            this.unverifiedOwnerModel.find({ registrationRequestSent: true, statusOfApproval: 'pending' }).skip(skip).limit(limit).exec(),
            this.unverifiedOwnerModel.countDocuments({ registrationRequestSent: true })
        ]);
        return { owners, total };
    }

    async approveOwnerRegistration(email: string): Promise<IVerifiedOwnerDocument> {
        const unverifiedOwner = await this.unverifiedOwnerModel.findOne({ email }).exec();
        console.log('approve cheyyenda owner:', unverifiedOwner);
        if (!unverifiedOwner) {
            throw new Error('Unverified owner not found');
        }

        unverifiedOwner.statusOfApproval = 'approved';
        await unverifiedOwner.save();

        const verifiedOwnerData: IOwner = {
            ...unverifiedOwner.toObject(),
            is_verified: true,
        };

        const newVerifiedOwner = new this.verifiedOwnerModel(verifiedOwnerData);
        await newVerifiedOwner.save();
        return newVerifiedOwner;
    }

    async rejectOwnerRegistration(email: string): Promise<IOwnerDocument> {
        const unverifiedOwner = await this.unverifiedOwnerModel.findOne({ email }).exec();
        if (!unverifiedOwner) {
            throw new Error('Unverified owner not found');
        }

        unverifiedOwner.statusOfApproval = 'rejected';
        return unverifiedOwner.save();
    }
}