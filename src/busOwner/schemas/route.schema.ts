import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Counter } from './counter.schema';

@Schema()
export class Route extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
    startingPoint: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
    endingPoint: Types.ObjectId;

    @Prop({ default: false })
    hasMoreStoppage: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Counter' }], default: [] })
    additionalStops: Types.ObjectId[];

    @Prop({ required: true })
    distance: string;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true, enum: ['Active', 'Inactive'] })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
}

export const RouteSchema = SchemaFactory.createForClass(Route);