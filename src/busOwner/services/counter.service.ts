import { Injectable } from '@nestjs/common';
import { CounterRepository } from '../repositories/counters.repositories';
import { CreateCounterDto } from '../dto/create-counter.dto';
import { Counter } from '../schemas/counter.schema';
@Injectable()
export class CounterService {
    constructor(private readonly counterRepository: CounterRepository) { }

    async createCounter(createCounterDto: CreateCounterDto): Promise<Counter> {
        return this.counterRepository.create(createCounterDto);
    }

    async getAllCounters(): Promise<Counter[]> {
        return this.counterRepository.findAll();
    }
}