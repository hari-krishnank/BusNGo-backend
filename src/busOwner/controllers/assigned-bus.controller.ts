import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { AssignedBusService } from '../services/assigned-bus.service';
import { CreateAssignedBusDto } from '../dto/create-assigned-bus.dto';
import { AssignedBus } from '../schemas/assigned-bus.schema';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('assigned-buses')
@UseGuards(OwnerJwtAuthGuard)
export class AssignedBusController {
    constructor(private assignedBusService: AssignedBusService) { }

    @Post()
    async createAssignedBus(@Request() req, @Body() createAssignedBusDto: CreateAssignedBusDto): Promise<AssignedBus> {
        const ownerId = req.user.ownerId
        return this.assignedBusService.createAssignedBus(createAssignedBusDto, ownerId);
    }

    @Get()
    async getAllAssignedBuses(@Request() req): Promise<AssignedBus[]> {
        const ownerId = req.user.ownerId
        return this.assignedBusService.getAllAssignedBuses(ownerId);
    }

    @Get(':id')
    async getAssignedBusById(@Request() req, @Param('id') id: string): Promise<AssignedBus> {
        const ownerId = req.user.ownerId
        return this.assignedBusService.getAssignedBusById(id, ownerId);
    }

    @Put(':id')
    async updateAssignedBus(
        @Request() req,
        @Param('id') id: string,
        @Body() updateAssignedBusDto: Partial<CreateAssignedBusDto>
    ): Promise<AssignedBus> {
        const ownerId = req.user.ownerId
        return this.assignedBusService.updateAssignedBus(id, updateAssignedBusDto, ownerId);
    }

    @Delete(':id')
    async deleteAssignedBus(@Request() req, @Param('id') id: string): Promise<AssignedBus> {
        const ownerId = req.user.ownerId
        return this.assignedBusService.deleteAssignedBus(id, ownerId);
    }
}