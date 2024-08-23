import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FleetType, FleetTypeDocument } from '../schemas/fleet-type.schema';

@Injectable()
export class FleetTypeRepository {
    constructor(
        @InjectModel(FleetType.name) private fleetTypeModel: Model<FleetTypeDocument>,
    ) { }

    async create(fleetType: Partial<FleetType> & { ownerId: Types.ObjectId }): Promise<FleetType> {
        const newFleetType = new this.fleetTypeModel(fleetType);
        return newFleetType.save();
    }

    async findAll(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ fleetTypes: FleetType[], total: number }> {
        const [fleetTypes, total] = await Promise.all([
            this.fleetTypeModel.find({ ownerId }).skip(skip).limit(limit).exec(),
            this.fleetTypeModel.countDocuments({ ownerId })
        ])
        return { fleetTypes, total }
    }

    async findById(id: string | Types.ObjectId): Promise<FleetType | null> {
        return this.fleetTypeModel.findById(id).exec();
    }
}