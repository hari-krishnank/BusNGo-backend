import { Document } from "mongoose";
import { IOwner } from "./owner.interface";

export interface IOwnerDocument extends IOwner, Document {
}