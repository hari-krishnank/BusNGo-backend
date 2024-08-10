import { IsNotEmpty, IsString, IsMongoId, IsArray, ArrayMinSize } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTripDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsMongoId()
    fleetType: string;

    @IsNotEmpty()
    @IsMongoId()
    route: string;

    @IsNotEmpty()
    @IsMongoId()
    schedule: string;

    @IsNotEmpty()
    @IsMongoId()
    startFrom: string;

    @IsNotEmpty()
    @IsMongoId()
    endTo: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    dayOff: string[];

    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId
}