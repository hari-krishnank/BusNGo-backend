import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Bus } from './bus.schema';
import { Trip } from './trip.schema';

export type AssignedBusDocument = AssignedBus & Document;

@Schema()
export class AssignedBus {
    @Prop({ type: Types.ObjectId, ref: 'Trip', required: true })
    trip: Trip;

    @Prop({ type: Types.ObjectId, ref: 'Bus', required: true })
    bus: Bus;

    @Prop({ default: 'Active' })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
} 

export const AssignedBusSchema = SchemaFactory.createForClass(AssignedBus);