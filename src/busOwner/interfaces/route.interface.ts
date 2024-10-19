import { Types } from "mongoose";

export interface IRoute {
    name: string;
    startingPoint: string;
    endingPoint: string;
    hasMoreStoppage: boolean;
    additionalStops: string[];
    distance: number;
    time: string;
    status: string;
}

export interface Route {
    _id: Types.ObjectId;
    name: string;
    schedule: {
        startFrom: string;
        end: string;
        duration: string;
    };
    additionalStops: string[];
    distance: number;
    time: string;
}