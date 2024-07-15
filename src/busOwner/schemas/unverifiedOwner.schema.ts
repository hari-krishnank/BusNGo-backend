import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IOwner } from "../interfaces/owner.interface";

@Schema({ timestamps: true })
export class unverifiedOwner extends Document implements IOwner {
    @Prop({ required: true })
    email: string;

    @Prop({ default: false })
    is_verified: boolean;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    mobile: string;

    @Prop()
    password: string;
}

export const UnverifiedOwnerSchema = SchemaFactory.createForClass(unverifiedOwner);
