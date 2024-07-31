import { Types } from 'mongoose';

export interface IBus {
    name: string;
    FleetType: Types.ObjectId;
    regNo: string;
    engineNo: string;
    chasisNo: string;
    ModelNo: string;
    status: string;
}