import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FleetTypeDocument = FleetType & Document;

@Schema()
export class FleetType {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'SeatLayout', required: true })
    seatLayout: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Amenity' }] })
    facilities: Types.ObjectId[];

    @Prop({ required: true, enum: ['Active', 'Inactive'] })
    status: string;

    @Prop({ required: true })
    acStatus: boolean;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId
}

export const FleetTypeSchema = SchemaFactory.createForClass(FleetType);