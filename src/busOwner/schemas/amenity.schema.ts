import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AmenityDocument = Amenity & Document;

@Schema()
export class Amenity {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    icon: string;

    @Prop({ default: 'Active' })
    status: string;
}

export const AmenitySchema = SchemaFactory.createForClass(Amenity);