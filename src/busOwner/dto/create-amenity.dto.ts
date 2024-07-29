import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAmenityDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    icon: string;
}