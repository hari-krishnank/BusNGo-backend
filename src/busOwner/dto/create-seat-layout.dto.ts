import { IsString, IsNumber, IsEnum, IsBoolean, IsArray } from 'class-validator';

enum DriverSeatPosition {
    Left = 'Left',
    Right = 'Right',
}

export class CreateSeatLayoutDto {
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
}