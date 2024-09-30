import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCoTravellerDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
    
    @IsNumber()
    age: number;

    @IsEmail()
    emailAddress: string;

    @IsString()
    @IsOptional()
    mobileNo?: string;

    @IsString()
    @IsOptional()
    streetAddress?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    pinZipCode?: string;

    @IsString()
    @IsOptional()
    country?: string;
    
    @IsNotEmpty()
    @Transform(({ value }) => new Types.ObjectId(value))
    userId: Types.ObjectId;
}