import { IsString, IsNumber, IsEnum, IsBoolean, IsArray, IsNotEmpty, IsIn, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

enum DriverSeatPosition {
    Left = 'Left',
    Right = 'Right',
}

export class CreateSeatLayoutDto {
    @IsString()
    layoutName: string;

    @IsEnum(DriverSeatPosition)
    driverSeatPosition: DriverSeatPosition;

    @IsNumber()
    rows: number;

    @IsNumber()
    columns: number;

    @IsBoolean()
    upperDeck: boolean;

    @IsArray()
    @IsString({ each: true })
    selectedSeats: string[];

    @IsNotEmpty()
    @IsString()
    @IsIn(['Active', 'Inactive'])
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId
}