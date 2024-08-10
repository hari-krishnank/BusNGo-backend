import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAmenityDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    icon: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['Active', 'Inactive'])
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId; 
}