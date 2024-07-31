import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bus } from '../schemas/bus.schema';
import { CreateBusDto } from '../dto/create-bus.dto';

@Injectable()
export class BusRepository {
    constructor(@InjectModel(Bus.name) private busModel: Model<Bus>) { }

    async create(createBusDto: CreateBusDto): Promise<Bus> {
        const createdBus = new this.busModel(createBusDto);
        return createdBus.save();
    }

    async findAll(): Promise<Bus[]> {
        return this.busModel.find().populate('FleetType').exec();
    }
}