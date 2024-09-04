import { IsString, IsNumber, IsArray, ValidateNested, IsMongoId, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { TripDetailsDto } from './tripDetails.dto';
import { TravellerDetailsDto } from './travellerDetails.dto';

export class CreatePendingBookingDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string;

    @IsString()
    @IsOptional()
    bookingId?: string;

    @IsMongoId()
    tripId: string;

    @IsMongoId()
    busId: string;

    @IsMongoId()
    routeId: string;

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
    
    @IsString()
    travelDate: string;
}