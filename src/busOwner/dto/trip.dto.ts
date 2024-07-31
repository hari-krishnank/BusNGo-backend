import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateTripDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsMongoId()
    fleetType: string;

    @IsNotEmpty()
    @IsMongoId()
    route: string;

    @IsNotEmpty()
    @IsMongoId()
    schedule: string;

    @IsNotEmpty()
    @IsMongoId()
    startFrom: string;

    @IsNotEmpty()
    @IsMongoId()
    endTo: string;

    @IsNotEmpty()
    @IsString()
    dayOff: string;
}