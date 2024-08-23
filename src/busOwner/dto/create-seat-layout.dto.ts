import { IsString, IsNumber, IsBoolean, IsArray, IsNotEmpty, IsIn, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSeatLayoutDto {
    @IsString()
    layoutName: string;

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