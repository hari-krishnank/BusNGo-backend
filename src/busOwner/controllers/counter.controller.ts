import { Controller, Get, Post, Body, Delete, Param, Put, UseGuards, Request } from '@nestjs/common';
import { CounterService } from '../services/counter.service';
import { CreateCounterDto } from '../dto/create-counter.dto';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('counters')
@UseGuards(OwnerJwtAuthGuard)
export class CounterController {
    constructor(private readonly counterService: CounterService) { }

    @Post()
    async createCounter(@Request() req, @Body() createCounterDto: CreateCounterDto) {
        const ownerId = req.user.ownerId
        console.log('Received counter data:', createCounterDto);
        console.log('Creating counter for owner', ownerId);
        return this.counterService.createCounter(createCounterDto, ownerId);
    }

    @Get()
    async getAllCounters(@Request() req) {
        const ownerId = req.user.ownerId
        return this.counterService.getAllCounters(ownerId);
    }

    @Put(':id')
    async updateCounter(@Request() req, @Param('id') id: string, @Body() updateCounterDto: Partial<CreateCounterDto>) {
        const ownerId = req.user.ownerId
        return this.counterService.updateCounter(id, updateCounterDto, ownerId);
    }

    @Delete(':id')
    async deleteCounter(@Request() req, @Param('id') id: string) {
        const ownerId = req.user.ownerId
        return this.counterService.deleteCounter(id, ownerId);
    }
} 