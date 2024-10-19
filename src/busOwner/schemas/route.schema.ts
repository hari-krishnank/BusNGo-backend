import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Route extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Schedule', required: true })
    schedule: Types.ObjectId | any;

    @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
    startingPoint: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Counter', required: true })
    endingPoint: Types.ObjectId;

    @Prop({ default: false })
    hasMoreStoppage: boolean;

    @Prop({ type: [{ _id: false, stop: { type: Types.ObjectId, ref: 'Counter' }, reachingTime: String }], default: [] })
    additionalStops: { stop: Types.ObjectId; reachingTime: string }[];

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