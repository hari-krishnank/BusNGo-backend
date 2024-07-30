import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FleetType, FleetTypeDocument } from '../schemas/fleet-type.schema';

@Injectable()
export class FleetTypeRepository {
    constructor(
        @InjectModel(FleetType.name) private fleetTypeModel: Model<FleetTypeDocument>,
    ) { }

    async create(fleetType: Partial<FleetType>): Promise<FleetType> {
        const newFleetType = new this.fleetTypeModel(fleetType);
        return newFleetType.save();
    }

    async findAll(): Promise<FleetType[]> {
        return this.fleetTypeModel.find().exec();
    }
}