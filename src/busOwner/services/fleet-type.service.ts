import { Injectable } from '@nestjs/common';
import { FleetTypeRepository } from '../repositories/fleet-type.repository';
import { FleetType } from '../schemas/fleet-type.schema';
import { Types } from 'mongoose';

@Injectable()
export class FleetTypeService {
    constructor(private fleetTypeRepository: FleetTypeRepository) { }
    
    async createFleetType(fleetTypeData: Partial<FleetType>, ownerId: string): Promise<FleetType> {
        const ownerIdWithFleetType = {
            ...fleetTypeData,
            ownerId: new Types.ObjectId(ownerId)
        };

        if (fleetTypeData.seatLayout && typeof fleetTypeData.seatLayout === 'string') {
            ownerIdWithFleetType.seatLayout = new Types.ObjectId(fleetTypeData.seatLayout);
        }

        if (fleetTypeData.facilities && Array.isArray(fleetTypeData.facilities)) {
            ownerIdWithFleetType.facilities = fleetTypeData.facilities.map(facility =>
                typeof facility === 'string' ? new Types.ObjectId(facility) : facility
            );
        }

        return this.fleetTypeRepository.create(ownerIdWithFleetType);
    }


    async getAllFleetTypes(ownerId: string): Promise<FleetType[]> {
        return this.fleetTypeRepository.findAll(new Types.ObjectId(ownerId));
    }

    async findById(id: string | Types.ObjectId): Promise<FleetType | null> {
        return this.fleetTypeRepository.findById(id);
    }   
}