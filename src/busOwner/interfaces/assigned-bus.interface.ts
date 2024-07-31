import { Document } from 'mongoose';
import { ITrip } from './trip.interface';
import { IBus } from './bus.interface';

export interface AssignedBus extends Document {
    trip: ITrip | string;
    bus: IBus | string;
    status: string;
}