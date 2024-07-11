import { IsString, IsEmail, IsBoolean } from 'class-validator';
import { IUser } from "../interfaces/user.interface";

export class CreateUserDto implements IUser {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    password: string;

    @IsBoolean()
    is_verified: boolean;
}