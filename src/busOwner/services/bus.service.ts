import { Injectable } from '@nestjs/common';
import { BusRepository } from '../repositories/bus.repository';
import { FleetTypeService } from './fleet-type.service';
import { CreateBusDto } from '../dto/create-bus.dto';
import { Bus } from '../schemas/bus.schema';
import { Types } from 'mongoose';

@Injectable()
export class BusService {
    constructor(
        private busRepository: BusRepository,
        private fleetTypeService: FleetTypeService
    ) { }

    async createBus(createBusDto: CreateBusDto, ownerId: string): Promise<Bus> {
        const fleetType = await this.fleetTypeService.findById(createBusDto.FleetType);
        if (!fleetType) {
            throw new Error('Invalid FleetType');
        }
        const busWithOwner = {
            ...createBusDto,
            ownerId: new Types.ObjectId(ownerId),
            FleetType: new Types.ObjectId(createBusDto.FleetType)
        }
        return this.busRepository.create(busWithOwner);
    }

    async getAllBuses(ownerId: string): Promise<Bus[]> {
        return this.busRepository.findAll(new Types.ObjectId(ownerId));
    }
}