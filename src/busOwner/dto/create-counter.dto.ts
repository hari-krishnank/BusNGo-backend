import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

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

    @IsNotEmpty()
    @IsString()
    @IsIn(['Active', 'Inactive'])
    status: string;
}