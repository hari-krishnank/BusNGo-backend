import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { IUserDocument } from "../interfaces/user-document.interface";
import { IUser } from "../interfaces/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { UnVerifiedUser } from "../schemas/unverified-user.schema";
import { IUnverifiedUserDocument } from "../interfaces/unverifieduser.document";

@Injectable()
export class UsersRepository {

  constructor(
    @InjectModel(User.name) private userModel: Model<IUserDocument>,
    @InjectModel(UnVerifiedUser.name) private readonly unverifiedUserModel: Model<IUnverifiedUserDocument>
  ) { }

  async create(userData: IUser): Promise<IUserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async createUnverifiedUser(userData: IUser): Promise<IUnverifiedUserDocument> {
    const newUnverifiedUser = new this.unverifiedUserModel(userData);
    return newUnverifiedUser.save();
  }

  async findUnverifiedByEmail(email: string): Promise<IUnverifiedUserDocument | null> {
    return this.unverifiedUserModel.findOne({ email }).exec();
  }

  async updateIsVerified(email: string): Promise<void> {
    await this.userModel.updateOne({ email }, { $set: { is_verified: true } }).exec();
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async deleteUnverifiedByEmail(email: string): Promise<void> {
    try {
      await this.unverifiedUserModel.deleteMany({ email }).exec();
    } catch (error) {
      throw new Error(`Error deleting unverified user by email: ${error.message}`);
    }
  }

  async getVerifiedUsers(skip: number, limit: number): Promise<{ users: any[], total: number }> {
    const [users, total] = await Promise.all([
      this.userModel.find({ is_verified: true }).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments()
    ]);
    return { users, total }
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUserBlockStatus(id: string, isBlocked: boolean) {
    return this.userModel.findByIdAndUpdate(id, { is_blocked: isBlocked }, { new: true });
  }

  async updateProfileImage(userId: string, profileImage: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { profile_image: profileImage },
      { new: true }
    ).exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string, expires: Date) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        refreshToken,
        refreshTokenExpires: expires
      },
      { new: true }
    ).exec();
  }

  async updateResetToken(userId: string, resetToken: string, resetTokenExpiration: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      resetToken,
      resetTokenExpiration,
    }).exec();
  }

  async findByResetToken(resetToken: string): Promise<any> {
    return this.userModel.findOne({ resetToken }).exec();
  }
}