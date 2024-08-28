import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Counter extends Document {
    @Prop({ required: true })
    name: string

    @Prop()
    city: string
 
    @Prop()
    location: string

    @Prop()
    mobileNumber: string

    @Prop({ required: true, enum: ['Active', 'Inactive'], default: 'Active' })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
}

export const counterSchema = SchemaFactory.createForClass(Counter)