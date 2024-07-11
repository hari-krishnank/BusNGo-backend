import { IsEmail, IsNumber } from "class-validator";

export class VerifyOtpDto {
    @IsEmail()
    email: string;

    @IsNumber()
    otp: number;
}
