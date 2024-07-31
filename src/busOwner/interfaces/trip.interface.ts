import { Types } from "mongoose";
import { FleetType } from "../schemas/fleet-type.schema";
import { Route } from "../schemas/route.schema";
import { Schedule } from "../schemas/schedule.schema";
import { Counter } from "../schemas/counter.schema";

export interface ITrip {
    title: string;
    fleetType: Types.ObjectId | FleetType;
    route: Types.ObjectId | Route;
    schedule: Types.ObjectId | Schedule;
    startFrom: Types.ObjectId | Counter;
    endTo: Types.ObjectId | Counter;
    dayOff: string;
    status?: string;
}