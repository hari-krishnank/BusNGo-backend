import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IOwner } from "../interfaces/owner.interface";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class verifiedOwner extends Document implements IOwner {
    @Prop({ required: true })
    email: string;

    @Prop({ default: false })
    is_verified: boolean;
   
    @Prop({ default: false })
    is_blocked: boolean;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    mobile: string;

    @Prop()
    password: string;

    @Prop()
    agencyName: string;

    @Prop()
    designation: string;

    @Prop()
    country: string;

    @Prop()
    state: string;

    @Prop()
    city: string;

    @Prop()
    postalCode: string;

    @Prop()
    address: string;
}

export const verifiedOwnerSchema = SchemaFactory.createForClass(verifiedOwner);