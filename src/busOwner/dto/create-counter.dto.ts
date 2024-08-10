import { IsNotEmpty, IsString, IsOptional, IsIn, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCounterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    mobileNumber?: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['Active', 'Inactive'])
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId
}