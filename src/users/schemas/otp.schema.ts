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
}

export const OtpSchema = SchemaFactory.createForClass(Otp)