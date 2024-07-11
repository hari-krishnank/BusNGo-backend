import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IUserDocument extends IUser, Document { }