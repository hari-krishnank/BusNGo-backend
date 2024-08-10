import { Types } from "mongoose";

export class CreateScheduleDto {
    startFrom: string;
    end: string;
    duration: string;
    status: 'Active' | 'Inactive';
    ownerId: Types.ObjectId;
}

export class UpdateScheduleDto {
    startFrom?: string;
    end?: string;
    duration?: string;
    status?: 'Active' | 'Inactive';
    ownerId?: Types.ObjectId;
}