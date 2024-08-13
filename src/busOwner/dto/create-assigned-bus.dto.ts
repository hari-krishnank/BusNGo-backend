import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAssignedBusDto {
    @IsNotEmpty()
    @IsMongoId()
    trip: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    bus: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    ownerId: Types.ObjectId
}