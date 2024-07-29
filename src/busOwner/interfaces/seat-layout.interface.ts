import { Document } from 'mongoose';

export interface SeatLayout extends Document {
    driverSeatPosition: string;
    rows: number;
    columns: number;
    upperDeck: boolean;
}