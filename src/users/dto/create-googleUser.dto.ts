import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class CreateGoogleUserDto implements IUser {
    @IsString()
    username: string;
    
    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    profileImage: string;

    @IsBoolean()
    is_verified: boolean;

    @IsBoolean()
    is_blocked: boolean;
    
    @IsBoolean()
    is_googleUser: boolean;
}