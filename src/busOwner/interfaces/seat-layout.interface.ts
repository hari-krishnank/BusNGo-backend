import { Document } from 'mongoose';

export interface SeatLayout extends Document {
    layoutName: string;
    driverSeatPosition: string;
    rows: number;
    columns: number;
    upperDeck: boolean;
}