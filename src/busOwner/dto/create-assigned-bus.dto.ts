import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAssignedBusDto {
    @IsNotEmpty()
    @IsMongoId()
    trip: string;

    @IsNotEmpty()
    @IsMongoId()
    bus: string;

    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId
}