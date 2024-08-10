import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Schedule extends Document {
    @Prop({ required: true })
    startFrom: string;

    @Prop({ required: true })
    end: string;

    @Prop({ required: true })
    duration: string;

    @Prop({ required: true, enum: ['Active', 'Inactive'] })
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);