import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.schema";

@Schema({ timestamps: true })
export class CoTraveller extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: User | Types.ObjectId;

    @Prop({ required: true })
    firstName: string

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    emailAddress: string;

    @Prop({ required: true })
    mobileNo: string;

    @Prop({ required: true })
    streetAddress: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pinZipCode: string;

    @Prop({ required: true })
    country: string;
}

export const CoTravellerSchema = SchemaFactory.createForClass(CoTraveller)