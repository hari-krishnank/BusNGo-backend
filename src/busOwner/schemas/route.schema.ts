import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Counter } from './counter.schema';

@Schema()
export class Route extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
    startingPoint: Counter;

    @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
    endingPoint: Counter;

    @Prop({ default: false })
    hasMoreStoppage: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Counter' }], default: [] })
    additionalStops: Counter[];

    @Prop({ required: true })
    distance: string;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true, enum: ['Active', 'Inactive'] })
    status: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);