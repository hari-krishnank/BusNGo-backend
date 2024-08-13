import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class SearchTripDto {
    @IsNotEmpty()
    @IsString()
    from: string

    @IsNotEmpty()
    @IsString()
    to: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;
} 