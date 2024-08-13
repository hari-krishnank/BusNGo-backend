import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { FleetType } from './fleet-type.schema';
import { Route } from './route.schema';
import { Schedule } from './schedule.schema';
import { Counter } from './counter.schema';

@Schema()
export class Trip extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FleetType', required: true })
  fleetType: FleetType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Route', required: true })
  route: Route;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Schedule', required: true })
  schedule: Schedule;

  @Prop({ required: true })
  ticketPrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Counter', required: true })
  startFrom: Counter;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Counter', required: true })
  endTo: Counter;

  @Prop({ type: [String], required: true })
  dayOff: string[];

  @Prop({ default: 'Active' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
  ownerId: Types.ObjectId;
}

export const TripSchema = SchemaFactory.createForClass(Trip);