import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserProfileRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async save(user: User): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            user._id,
            { $set: { profileImage: user.profileImage } },
            { new: true }
        ).exec();

        if (!updatedUser) {
            throw new Error('Failed to update user');
        }

        return updatedUser;
    }
}