import { Injectable } from '@nestjs/common';
import { BusRepository } from '../repositories/bus.repository';
import { FleetTypeService } from './fleet-type.service';
import { CreateBusDto } from '../dto/create-bus.dto';
import { Bus } from '../schemas/bus.schema';

@Injectable()
export class BusService {
    constructor(
        private busRepository: BusRepository,
        private fleetTypeService: FleetTypeService
    ) { }

    async createBus(createBusDto: CreateBusDto): Promise<Bus> {
        const fleetType = await this.fleetTypeService.findById(createBusDto.FleetType);
        if (!fleetType) {
            throw new Error('Invalid FleetType');
        }
        return this.busRepository.create(createBusDto);
    }

    async getAllBuses(): Promise<Bus[]> {
        return this.busRepository.findAll();
    }
}