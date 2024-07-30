import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Amenity } from './amenity.schema';
import { SeatLayout } from './seat-layout.schema';

export type FleetTypeDocument = FleetType & Document;

@Schema()
export class FleetType {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'SeatLayout', required: true })
    seatLayout: SeatLayout;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Amenity' }] })
    facilities: Amenity[];

    @Prop({ required: true, enum: ['Active', 'Inactive'] })
    status: string;

    @Prop({ required: true })
    acStatus: boolean;
}

export const FleetTypeSchema = SchemaFactory.createForClass(FleetType);