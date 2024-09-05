import { ConflictException, Injectable } from '@nestjs/common';
import { AssignedBusRepository } from '../repositories/assigned-bus.repository';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';
import { AssignedBus } from '../schemas/assigned-bus.schema';
import { Types } from 'mongoose';

@Injectable()
export class AssignedBusService {
    constructor(private assignedBusRepository: AssignedBusRepository) { }
    async createAssignedBus(createAssignedBusDto: CreateAssignedBusDto, ownerId: string): Promise<AssignedBus> {
        const busId = new Types.ObjectId(createAssignedBusDto.bus);
        const tripId = new Types.ObjectId(createAssignedBusDto.trip);
        const ownerObjectId = new Types.ObjectId(ownerId);

        const existingAssignment = await this.assignedBusRepository.findOverlappingAssignment(busId, tripId, ownerObjectId);

        if (existingAssignment) {
            throw new ConflictException('This bus is already assigned to another trip.');
        }

        const assignedBusWithOwner = {
            ...createAssignedBusDto,
            trip: tripId,
            bus: busId,
            ownerId: ownerObjectId
        }
        return this.assignedBusRepository.create(assignedBusWithOwner);
    }

    async updateAssignedBus(id: string, updateAssignedBusDto: Partial<CreateAssignedBusDto>, ownerId: string): Promise<AssignedBus> {
        if (updateAssignedBusDto.bus) {
            const busId = new Types.ObjectId(updateAssignedBusDto.bus);
            const tripId = new Types.ObjectId(id);
            const ownerObjectId = new Types.ObjectId(ownerId);

            const existingAssignment = await this.assignedBusRepository.findOverlappingAssignment(busId, tripId, ownerObjectId);

            if (existingAssignment) {
                throw new ConflictException('This bus is already assigned to another trip.');
            }
        }

        return this.assignedBusRepository.update(id, updateAssignedBusDto, new Types.ObjectId(ownerId));
    }

    async getAllAssignedBuses(ownerId: string, page: number, limit: number): Promise<{ assignedBuses: AssignedBus[], total: number }> {
        const skip = (page - 1) * limit
        return this.assignedBusRepository.findAll(new Types.ObjectId(ownerId), skip, limit);
    }

    async getAssignedBusById(id: string, ownerId: string): Promise<AssignedBus> {
        return this.assignedBusRepository.findById(id, new Types.ObjectId(ownerId));
    }

    async deleteAssignedBus(id: string, ownerId: string): Promise<AssignedBus> {
        return this.assignedBusRepository.delete(id, new Types.ObjectId(ownerId));
    }
}