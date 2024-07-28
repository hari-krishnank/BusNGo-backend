import { Controller, Get, Post, Body } from '@nestjs/common';
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
}