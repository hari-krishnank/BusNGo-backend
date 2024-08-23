import { IsNumber, IsString } from "class-validator";

export class TravellerDetailsDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsNumber()
    age: number;

    @IsString()
    gender: string;
}
