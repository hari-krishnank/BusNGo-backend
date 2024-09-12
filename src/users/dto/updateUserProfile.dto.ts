import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserProfileDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    mobileNumber?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    dob?: Date;

    @IsString()
    @IsOptional()
    gender?: string;
}