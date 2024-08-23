import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { FleetTypeService } from '../services/fleet-type.service';
import { FleetType } from '../schemas/fleet-type.schema';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('fleet-types')
@UseGuards(OwnerJwtAuthGuard)
export class FleetTypeController {
    constructor(private fleetTypeService: FleetTypeService) { }

    @Post()
    async createFleetType(@Request() req, @Body() fleetTypeData: Partial<FleetType>) {
        const ownerId = req.user.ownerId
        console.log('Creating counter for owner', ownerId);
        return this.fleetTypeService.createFleetType(fleetTypeData, ownerId);
    }

    @Get()
    async getAllFleetTypes(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5
    ) {
        const ownerId = req.user.ownerId
        return this.fleetTypeService.getAllFleetTypes(ownerId, page, limit);
    }
}