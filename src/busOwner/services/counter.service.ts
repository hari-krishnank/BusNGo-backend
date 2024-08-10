import { Injectable } from '@nestjs/common';
import { CounterRepository } from '../repositories/counters.repositories';
import { CreateCounterDto } from '../dto/create-counter.dto';
import { Counter } from '../schemas/counter.schema';
import { Types } from 'mongoose';
@Injectable()
export class CounterService {
    constructor(private readonly counterRepository: CounterRepository) { }

    async createCounter(createCounterDto: CreateCounterDto, ownerId: string): Promise<Counter> {
        const counterWithOwner = {
            ...createCounterDto,
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.counterRepository.create(counterWithOwner)
    }

    async getAllCounters(ownerId: string): Promise<Counter[]> {
        return this.counterRepository.findAll(new Types.ObjectId(ownerId));
    }

    async updateCounter(id: string, updateCounterDto: Partial<CreateCounterDto>, ownerId: string): Promise<Counter> {
        return this.counterRepository.update(id, updateCounterDto, new Types.ObjectId(ownerId));
    }

    async deleteCounter(id: string, ownerId: string): Promise<Counter> {
        return this.counterRepository.delete(id, new Types.ObjectId(ownerId));
    }

    async findById(id: string | Types.ObjectId): Promise<Counter | null> {
        return this.counterRepository.findById(id);
    }
}  