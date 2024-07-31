import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBusDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsMongoId()
    FleetType: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    regNo: string;

    @IsNotEmpty()
    @IsString()
    engineNo: string;

    @IsNotEmpty()
    @IsString()
    chasisNo: string;

    @IsNotEmpty()
    @IsString()
    ModelNo: string;
}