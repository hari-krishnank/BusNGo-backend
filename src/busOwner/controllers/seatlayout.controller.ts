import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { SeatLayoutsService } from '../services/seat-layouts.service';
import { CreateSeatLayoutDto } from '../dto/create-seat-layout.dto';
import { UpdateSeatLayoutDto } from '../dto/update-seat-layout.dto';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';
import { Types } from 'mongoose';

@Controller('seat-layouts')
@UseGuards(OwnerJwtAuthGuard)
export class SeatLayoutsController {
    constructor(private readonly seatLayoutsService: SeatLayoutsService) { }

    @Post()
    async create(@Request() req, @Body() createSeatLayoutDto: CreateSeatLayoutDto) {
        const ownerId = new Types.ObjectId(req.user.ownerId)
        console.log('Received in controller:', createSeatLayoutDto);
        console.log('Creating seat layout for owner', ownerId);
        return this.seatLayoutsService.create({ ...createSeatLayoutDto, ownerId });
    }

    @Get()
    async findAll(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5
    ) {
        const ownerId = new Types.ObjectId(req.user.ownerId);
        return this.seatLayoutsService.findAll(ownerId, page, limit);
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id') id: string) {
        const ownerId = new Types.ObjectId(req.user.ownerId)
        return this.seatLayoutsService.findOne(id, ownerId);
    }

    @Put(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateSeatLayoutDto: UpdateSeatLayoutDto) {
        const ownerId = new Types.ObjectId(req.user.ownerId)
        return this.seatLayoutsService.update(id, updateSeatLayoutDto, ownerId);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const ownerId = new Types.ObjectId(req.user.ownerId)
        return this.seatLayoutsService.remove(id, ownerId);
    }
}