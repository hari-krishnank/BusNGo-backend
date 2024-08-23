import { IsArray, IsNumber, IsObject, IsString } from "class-validator";

export class TripDetailsDto {
    @IsObject()
    bus: any;

    @IsArray()
    dayOff: string[];

    @IsObject()
    endTo: any;

    @IsObject()
    busType: any;

    @IsString()
    ownerId: string;

    @IsObject()
    route: any;

    @IsArray()
    selectedSeats: string[];

    @IsObject()
    startFrom: any;

    @IsString()
    status: string;

    @IsNumber()
    ticketPrice: number;

    @IsString()
    title: string;

    @IsNumber()
    __v: number;

    @IsString()
    _id: string;
}