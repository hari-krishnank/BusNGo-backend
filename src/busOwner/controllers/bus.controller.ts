import { Controller, Post, Body, Get } from '@nestjs/common';
import { BusService } from '../services/bus.service';
import { CreateBusDto } from '../dto/create-bus.dto';
import { Bus } from '../schemas/bus.schema';

@Controller('buses')
export class BusController {
    constructor(private busService: BusService) { }

    @Post()
    async createBus(@Body() createBusDto: CreateBusDto): Promise<Bus> {
        return this.busService.createBus(createBusDto);
    }

    @Get()
    async getAllBuses(): Promise<Bus[]> {
        return this.busService.getAllBuses();
    }
}