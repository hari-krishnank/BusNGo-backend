import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { FleetType } from './fleet-type.schema';
import { Route } from './route.schema';

@Schema()
export class TicketPrice extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FleetType', required: true })
  fleetType: FleetType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Route', required: true })
  route: Route;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'Active' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
  ownerId: Types.ObjectId;
}

export const TicketPriceSchema = SchemaFactory.createForClass(TicketPrice);