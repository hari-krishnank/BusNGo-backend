import { IsString, IsBoolean, IsArray, IsNumber, IsEnum, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRouteDto {
    @IsString()
    name: string;

    @IsMongoId()
    startingPoint: Types.ObjectId;

    @IsMongoId()
    endingPoint: Types.ObjectId;

    @IsBoolean()
    hasMoreStoppage: boolean;

    @IsArray()
    @IsMongoId({ each: true })
    additionalStops: Types.ObjectId[];

    @IsString()
    distance: string;

    @IsString()
    time: string;

    @IsEnum(['Active', 'Inactive'])
    status: string;
}