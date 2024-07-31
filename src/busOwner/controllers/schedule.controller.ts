import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Controller('schedules')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) { }

    @Post()
    create(@Body() createScheduleDto: CreateScheduleDto) {
        return this.scheduleService.create(createScheduleDto);
    }

    @Get()
    findAll() {
        return this.scheduleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.scheduleService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
        return this.scheduleService.update(id, updateScheduleDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.scheduleService.delete(id);
    }
}