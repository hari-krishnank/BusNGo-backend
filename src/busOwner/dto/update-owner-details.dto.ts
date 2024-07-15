import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateOwnerDetailsDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
