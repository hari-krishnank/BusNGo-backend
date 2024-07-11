import { Document } from "mongoose";
import { IOtp } from "./otp.interface";

export interface IOtpDocument extends IOtp, Document {
    expiresAt: Date;
}