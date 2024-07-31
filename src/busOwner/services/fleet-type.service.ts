import { Injectable } from '@nestjs/common';
import { FleetTypeRepository } from '../repositories/fleet-type.repository';
import { FleetType } from '../schemas/fleet-type.schema';
import { Types } from 'mongoose';

@Injectable()
export class FleetTypeService {
    constructor(private fleetTypeRepository: FleetTypeRepository) { }

    async createFleetType(fleetTypeData: Partial<FleetType>): Promise<FleetType> {
        return this.fleetTypeRepository.create(fleetTypeData);
    }

    async getAllFleetTypes(): Promise<FleetType[]> {
        return this.fleetTypeRepository.findAll();
    }

    async findById(id: string | Types.ObjectId): Promise<FleetType | null> {
        return this.fleetTypeRepository.findById(id);
    }
}   