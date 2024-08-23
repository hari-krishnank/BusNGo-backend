import { Types } from 'mongoose';
import { IsMongoId, IsString } from 'class-validator';

export class AdditionalStop {
    @IsMongoId()
    stop: Types.ObjectId;

    @IsString()
    reachingTime: string;
}