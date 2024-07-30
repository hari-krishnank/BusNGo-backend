import { Controller, Post, Body, Get } from '@nestjs/common';
import { FleetTypeService } from '../services/fleet-type.service';
import { FleetType } from '../schemas/fleet-type.schema';

@Controller('fleet-types')
export class FleetTypeController {
    constructor(private fleetTypeService: FleetTypeService) { }

    @Post()
    async createFleetType(@Body() fleetTypeData: Partial<FleetType>) {
        return this.fleetTypeService.createFleetType(fleetTypeData);
    }

    @Get()
    async getAllFleetTypes() {
        return this.fleetTypeService.getAllFleetTypes();
    }
}