import { Injectable } from '@nestjs/common';
import { AssignedBusRepository } from '../repositories/assigned-bus.repository';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';
import { AssignedBus } from '../schemas/assigned-bus.schema';

@Injectable()
export class AssignedBusService {
    constructor(private assignedBusRepository: AssignedBusRepository) { }

    async createAssignedBus(createAssignedBusDto: CreateAssignedBusDto): Promise<AssignedBus> {
        return this.assignedBusRepository.create(createAssignedBusDto);
    }

    async getAllAssignedBuses(): Promise<AssignedBus[]> {
        return this.assignedBusRepository.findAll();
    }

    async getAssignedBusById(id: string): Promise<AssignedBus> {
        return this.assignedBusRepository.findById(id);
    }

    async updateAssignedBus(id: string, updateAssignedBusDto: Partial<CreateAssignedBusDto>): Promise<AssignedBus> {
        return this.assignedBusRepository.update(id, updateAssignedBusDto);
    }

    async deleteAssignedBus(id: string): Promise<AssignedBus> {
        return this.assignedBusRepository.delete(id);
    }
}