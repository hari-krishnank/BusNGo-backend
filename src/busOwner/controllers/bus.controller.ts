import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { BusService } from '../services/bus.service';
import { CreateBusDto } from '../dto/create-bus.dto';
import { Bus } from '../schemas/bus.schema';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('buses')
@UseGuards(OwnerJwtAuthGuard)
export class BusController {
    constructor(private busService: BusService) { }

    @Post()
    async createBus(@Request() req, @Body() createBusDto: CreateBusDto): Promise<Bus> {
        const ownerId = req.user.ownerId
        return this.busService.createBus(createBusDto, ownerId);
    }

    @Get()
    async getAllBuses(@Request() req): Promise<Bus[]> {
        const ownerId = req.user.ownerId
        return this.busService.getAllBuses(ownerId);
    }
}