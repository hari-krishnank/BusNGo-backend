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
        console.log('before saving ownerData', ownerData);
        const newVerifiedOwner = new this.verifiedOwnerModel(ownerData);
        console.log('new owner', newVerifiedOwner);

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

    async updateUnverifiedOwner(ownerData: IOwner): Promise<IOwnerDocument> {
        const filter = { email: ownerData.email };
        const update = { ...ownerData };
        console.log(update);

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
}