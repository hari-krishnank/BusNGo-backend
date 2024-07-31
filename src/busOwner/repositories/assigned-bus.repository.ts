import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignedBus, AssignedBusDocument } from '../schemas/assigned-bus.schema';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';

@Injectable()
export class AssignedBusRepository {
    constructor(
        @InjectModel(AssignedBus.name) private assignedBusModel: Model<AssignedBusDocument>
    ) { }

    async create(createAssignedBusDto: CreateAssignedBusDto): Promise<AssignedBus> {
        const newAssignedBus = new this.assignedBusModel(createAssignedBusDto);
        return newAssignedBus.save();
    }

    async findAll(): Promise<AssignedBus[]> {
        return this.assignedBusModel.find().populate('trip').populate('bus').exec();
    }

    async findById(id: string): Promise<AssignedBus> {
        return this.assignedBusModel.findById(id).populate('trip').populate('bus').exec();
    }

    async update(id: string, updateAssignedBusDto: Partial<CreateAssignedBusDto>): Promise<AssignedBus> {
        return this.assignedBusModel.findByIdAndUpdate(id, updateAssignedBusDto, { new: true }).exec();
    }

    async delete(id: string): Promise<AssignedBus> {
        return this.assignedBusModel.findByIdAndDelete(id).exec();
    }
}