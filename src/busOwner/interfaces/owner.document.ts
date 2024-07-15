import { Document } from "mongoose";
import { IOwner } from "./owner.interface";

export interface IVerifiedOwnerDocument extends IOwner, Document {
}