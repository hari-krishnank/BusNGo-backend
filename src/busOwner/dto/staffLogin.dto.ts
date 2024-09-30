import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class StaffLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}