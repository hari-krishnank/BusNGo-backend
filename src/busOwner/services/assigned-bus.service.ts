import { Injectable } from '@nestjs/common';
import { AssignedBusRepository } from '../repositories/assigned-bus.repository';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';
import { AssignedBus } from '../schemas/assigned-bus.schema';
import { Types } from 'mongoose';

@Injectable()
export class AssignedBusService {
    constructor(private assignedBusRepository: AssignedBusRepository) { }

    async createAssignedBus(createAssignedBusDto: CreateAssignedBusDto, ownerId: string): Promise<AssignedBus> {
        const assignedBusWithOwner = {
            ...createAssignedBusDto,
            trip: new Types.ObjectId(createAssignedBusDto.trip),
            bus: new Types.ObjectId(createAssignedBusDto.bus),
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.assignedBusRepository.create(assignedBusWithOwner);
    }

    async getAllAssignedBuses(ownerId: string): Promise<AssignedBus[]> {
        return this.assignedBusRepository.findAll(new Types.ObjectId(ownerId));
    }

    async getAssignedBusById(id: string, ownerId: string): Promise<AssignedBus> {
        return this.assignedBusRepository.findById(id, new Types.ObjectId(ownerId));
    }

    async updateAssignedBus(id: string, updateAssignedBusDto: Partial<CreateAssignedBusDto>, ownerId: string): Promise<AssignedBus> {
        return this.assignedBusRepository.update(id, updateAssignedBusDto, new Types.ObjectId(ownerId));
    }

    async deleteAssignedBus(id: string, ownerId: string): Promise<AssignedBus> {
        return this.assignedBusRepository.delete(id, new Types.ObjectId(ownerId));
    }
}