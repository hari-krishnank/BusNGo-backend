import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('schedules')
@UseGuards(OwnerJwtAuthGuard)
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) { }

    @Post()
    create(@Request() req, @Body() createScheduleDto: CreateScheduleDto) {
        const ownerId = req.user.ownerId
        console.log('owner id for the schedule', ownerId);
        return this.scheduleService.create(createScheduleDto, ownerId);
    }

    @Get()
    findAll(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5) {
        const ownerId = req.user.ownerId
        return this.scheduleService.findAll(ownerId, page, limit);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const ownerId = req.user.ownerId
        return this.scheduleService.findOne(id, ownerId);
    }

    @Put(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
        const ownerId = req.user.ownerId
        return this.scheduleService.update(id, updateScheduleDto, ownerId);
    }

    @Delete(':id')
    delete(@Request() req, @Param('id') id: string) {
        const ownerId = req.user.ownerId
        return this.scheduleService.delete(id, ownerId);
    }
}