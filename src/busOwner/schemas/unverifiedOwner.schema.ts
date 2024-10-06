import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IOwnerDocument } from "../interfaces/verifiedOwner.document";

@Schema({ timestamps: true })
export class unverifiedOwner extends Document implements IOwnerDocument {
    @Prop({ required: true })
    email: string;

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

    @Prop({ default: false })
    is_verified: boolean;

    @Prop({ default: false })
    registrationRequestSent: boolean;
    
    @Prop({ default: 'pending'})
    statusOfApproval: string;
}

export const UnverifiedOwnerSchema = SchemaFactory.createForClass(unverifiedOwner);