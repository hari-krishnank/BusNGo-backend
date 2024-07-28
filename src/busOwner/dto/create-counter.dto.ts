import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCounterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    mobileNumber?: string;
}