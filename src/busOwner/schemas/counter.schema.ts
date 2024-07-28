import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

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
}

export const counterSchema = SchemaFactory.createForClass(Counter)