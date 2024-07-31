import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { CounterService } from '../services/counter.service';
import { CreateCounterDto } from '../dto/create-counter.dto';
import { Counter } from '../schemas/counter.schema';

@Controller('counters')
export class CounterController {
    constructor(private readonly counterService: CounterService) { }

    @Post()
    async createCounter(@Body() createCounterDto: CreateCounterDto): Promise<Counter> {
        console.log('Received counter data:', createCounterDto);
        return this.counterService.createCounter(createCounterDto);
    }

    @Get()
    async getAllCounters(): Promise<Counter[]> {
        return this.counterService.getAllCounters();
    }

    @Put(':id')
    async updateCounter(
        @Param('id') id: string,
        @Body() updateCounterDto: Partial<CreateCounterDto>
    ): Promise<Counter> {
        return this.counterService.updateCounter(id, updateCounterDto);
    }

    @Delete(':id')
    async deleteCounter(@Param('id') id: string): Promise<Counter> {
        return this.counterService.deleteCounter(id);
    }
}