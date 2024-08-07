import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AmenityDocument = Amenity & Document;

@Schema()
export class Amenity {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    icon: string;

    @Prop({ required: true, enum: ['Active', 'Inactive'], default: 'Active' })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);