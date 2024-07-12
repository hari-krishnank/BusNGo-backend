import { Document } from "mongoose";
import { IUnverifiedUser } from "./unverifieduser.interface";

export interface IUnverifiedUserDocument extends IUnverifiedUser, Document { }