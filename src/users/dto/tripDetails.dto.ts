import { IsArray } from "class-validator";

export class TripDetailsDto {
    @IsArray()
    selectedSeatNumbers: string[]

    @IsArray()
    selectedSeats: string[];
}