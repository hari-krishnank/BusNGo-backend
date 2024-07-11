import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { IUserDocument } from "../interfaces/user-document.interface";
import { IUser } from "../interfaces/user.interface";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersRepository {

  constructor(@InjectModel(User.name) private userModel: Model<IUserDocument>) { }

  async create(userData: IUser): Promise<IUserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async updateIsVerified(email: string): Promise<void> {
    await this.userModel.updateOne({ email }, { $set: { is_verified: true } }).exec();
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }
}