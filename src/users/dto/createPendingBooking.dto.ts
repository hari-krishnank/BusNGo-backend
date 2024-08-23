import { IsString, IsNumber, IsArray, ValidateNested, IsMongoId, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { TripDetailsDto } from './tripDetails.dto';
import { TravellerDetailsDto } from './travellerDetails.dto';

export class CreatePendingBookingDto {
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    bookingId?: string;

    @IsMongoId()
    tripId: string;

    @IsObject()
    @ValidateNested()
    @Type(() => TripDetailsDto)
    tripDetails: TripDetailsDto;

    @IsMongoId()
    boardingPoint: string;

    @IsMongoId()
    droppingPoint: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TravellerDetailsDto)
    travellersDetails: TravellerDetailsDto[];

    @IsNumber()
    totalTicketPrice: number;

    @IsString()
    email: string;

    @IsString()
    phone: string;
}