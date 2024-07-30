import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SeatLayoutsService } from '../services/seat-layouts.service';
import { CreateSeatLayoutDto } from '../dto/create-seat-layout.dto';
import { UpdateSeatLayoutDto } from '../dto/update-seat-layout.dto';

@Controller('seat-layouts')
export class SeatLayoutsController {
    constructor(private readonly seatLayoutsService: SeatLayoutsService) { }

    @Post()
    create(@Body() createSeatLayoutDto: CreateSeatLayoutDto) {
        console.log('Received in controller:', createSeatLayoutDto);
        return this.seatLayoutsService.create(createSeatLayoutDto);
    }

    @Get()
    findAll() {
        return this.seatLayoutsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.seatLayoutsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSeatLayoutDto: UpdateSeatLayoutDto) {
        return this.seatLayoutsService.update(id, updateSeatLayoutDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.seatLayoutsService.remove(id);
    }
}