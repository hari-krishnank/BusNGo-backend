import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FleetType } from '../schemas/fleet-type.schema';

@Schema()
export class Bus extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'FleetType', required: true })
    FleetType: FleetType;

    @Prop({ required: true })
    regNo: string;

    @Prop({ required: true })
    engineNo: string;

    @Prop({ required: true })
    chasisNo: string;

    @Prop({ required: true })
    ModelNo: string;

    @Prop({ default: 'Active' })
    status: string;
}

export const BusSchema = SchemaFactory.createForClass(Bus);