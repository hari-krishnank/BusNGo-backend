import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Counter', required: true })
  startFrom: Counter;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Counter', required: true })
  endTo: Counter;

  @Prop({ required: true })
  dayOff: string;

  @Prop({ default: 'Active' })
  status: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);