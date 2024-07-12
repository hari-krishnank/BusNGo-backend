import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IOtp } from "../interfaces/otp.interface";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Otp extends Document implements IOtp {
    @Prop()
    email: string;

    @Prop()
    otp: number;

    @Prop()
    expiresAt: Date;

    @Prop({ default: Date.now(), expires: 60 }) 
    createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp)
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });