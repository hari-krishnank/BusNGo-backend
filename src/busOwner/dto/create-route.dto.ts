import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsArray, IsNumber, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRouteDto {
    @IsString()
    name: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    startingPoint: Types.ObjectId;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    endingPoint: Types.ObjectId; 

    @IsBoolean()
    hasMoreStoppage: boolean;

    @IsArray()
    @IsMongoId({ each: true })
    @Type(() => Types.ObjectId)
    additionalStops: Types.ObjectId[];

    @IsString()
    distance: string;

    @IsString()
    time: string;

    @IsEnum(['Active', 'Inactive'])
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    ownerId:Types.ObjectId
}