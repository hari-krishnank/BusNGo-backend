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

    async updateCounter(id: string, updateCounterDto: Partial<CreateCounterDto>): Promise<Counter> {
        return this.counterRepository.update(id, updateCounterDto);
    }

    async deleteCounter(id: string): Promise<Counter> {
        return this.counterRepository.delete(id);
    }
}