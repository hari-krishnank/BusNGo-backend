import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AssignedBusService } from '../services/assigned-bus.service';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';
import { AssignedBus } from '../schemas/assigned-bus.schema';

@Controller('assigned-buses')
export class AssignedBusController {
    constructor(private assignedBusService: AssignedBusService) { }

    @Post()
    async createAssignedBus(@Body() createAssignedBusDto: CreateAssignedBusDto): Promise<AssignedBus> {
        return this.assignedBusService.createAssignedBus(createAssignedBusDto);
    }

    @Get()
    async getAllAssignedBuses(): Promise<AssignedBus[]> {
        return this.assignedBusService.getAllAssignedBuses();
    }

    @Get(':id')
    async getAssignedBusById(@Param('id') id: string): Promise<AssignedBus> {
        return this.assignedBusService.getAssignedBusById(id);
    }

    @Put(':id')
    async updateAssignedBus(
        @Param('id') id: string,
        @Body() updateAssignedBusDto: Partial<CreateAssignedBusDto>
    ): Promise<AssignedBus> {
        return this.assignedBusService.updateAssignedBus(id, updateAssignedBusDto);
    }

    @Delete(':id')
    async deleteAssignedBus(@Param('id') id: string): Promise<AssignedBus> {
        return this.assignedBusService.deleteAssignedBus(id);
    }
}