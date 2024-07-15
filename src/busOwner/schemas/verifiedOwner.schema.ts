import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IOwner } from "../interfaces/owner.interface";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class verifiedOwner extends Document implements IOwner {
    @Prop({ required: true })
    email: string;

    @Prop({ default: false })
    is_verified: boolean;
}

export const verifiedOwnerSchema = SchemaFactory.createForClass(verifiedOwner);