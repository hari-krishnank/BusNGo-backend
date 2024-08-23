import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bus } from '../schemas/bus.schema';
import { CreateBusDto } from '../dto/create-bus.dto';

@Injectable()
export class BusRepository {
    constructor(@InjectModel(Bus.name) private busModel: Model<Bus>) { }

    async create(createBusDto: CreateBusDto & { ownerId: Types.ObjectId }): Promise<Bus> {
        const createdBus = new this.busModel(createBusDto);
        return createdBus.save();
    }

    async findAll(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ buses: Bus[], total: number }> {
        const [buses, total] = await Promise.all([
            this.busModel.find({ ownerId }).skip(skip).limit(limit).exec(),
            this.busModel.countDocuments({ ownerId })
        ])
        return { buses, total }
    }
}