import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateAssignedBusDto {
    @IsNotEmpty()
    @IsMongoId()
    trip: string;

    @IsNotEmpty()
    @IsMongoId()
    bus: string;
}