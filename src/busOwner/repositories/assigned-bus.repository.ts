import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AssignedBus, AssignedBusDocument } from '../schemas/assigned-bus.schema';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';

@Injectable()
export class AssignedBusRepository {
    constructor(
        @InjectModel(AssignedBus.name) private assignedBusModel: Model<AssignedBusDocument>
    ) { }

    async create(createAssignedBusDto: CreateAssignedBusDto & { ownerId: Types.ObjectId }): Promise<AssignedBus> {
        const newAssignedBus = new this.assignedBusModel(createAssignedBusDto);
        return newAssignedBus.save();
    }

    async findAll(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ assignedBuses: AssignedBus[], total: number }> {
        const [assignedBuses, total] = await Promise.all([
            this.assignedBusModel.find({ ownerId }).skip(skip).limit(limit).populate('trip').populate('bus').exec(),
            this.assignedBusModel.countDocuments({ ownerId })
        ])
        return { assignedBuses, total }
    }

    async findById(id: string, ownerId: Types.ObjectId): Promise<AssignedBus> {
        return this.assignedBusModel.findById({ _id: id, ownerId }).populate('trip').populate('bus').exec();
    }

    async findOverlappingAssignment(busId: Types.ObjectId, tripId: Types.ObjectId, ownerId: Types.ObjectId): Promise<AssignedBus | null> {
        return this.assignedBusModel.findOne({
            bus: busId,
            ownerId: ownerId,
            _id: { $ne: tripId }, 
            status: 'Active'
        }).populate('trip').exec();
    }

    async update(id: string, updateAssignedBusDto: Partial<CreateAssignedBusDto>, ownerId: Types.ObjectId): Promise<AssignedBus> {
        return this.assignedBusModel.findByIdAndUpdate({ _id: id, ownerId }, updateAssignedBusDto, { new: true }).exec();
    }

    async delete(id: string, ownerId: Types.ObjectId): Promise<AssignedBus> {
        return this.assignedBusModel.findByIdAndDelete({ _id: id, ownerId }).exec();
    }
}