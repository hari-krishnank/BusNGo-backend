import { BadRequestException, Injectable } from '@nestjs/common';
import { CounterRepository } from '../repositories/counters.repositories';
import { CreateCounterDto } from '../dto/create-counter.dto';
import { Counter } from '../schemas/counter.schema';
import { Types } from 'mongoose';
@Injectable() 
export class CounterService {
    constructor(private readonly counterRepository: CounterRepository) { }

    async createCounter(createCounterDto: CreateCounterDto, ownerId: string): Promise<Counter> {
        const ownerIdObj = new Types.ObjectId(ownerId);

        if (await this.counterRepository.checkExistence('name', createCounterDto.name, ownerIdObj)) {
            throw new BadRequestException(`A counter with the name "${createCounterDto.name}" already exists`);
        }

        if (createCounterDto.city && await this.counterRepository.checkExistence('city', createCounterDto.city, ownerIdObj)) {
            throw new BadRequestException(`A counter in the city "${createCounterDto.city}" already exists`);
        }

        if (createCounterDto.location && await this.counterRepository.checkExistence('location', createCounterDto.location, ownerIdObj)) {
            throw new BadRequestException(`A counter at the location "${createCounterDto.location}" already exists`);
        }

        const counterWithOwner = {
            ...createCounterDto,
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.counterRepository.create(counterWithOwner)
    }

    async getAllCounters(ownerId: string, page: number, limit: number): Promise<{ counters: Counter[], total: number }> {
        const skip = (page - 1) * limit;
        return this.counterRepository.findAllPaginated(new Types.ObjectId(ownerId), skip, limit);
    }

    async updateCounter(id: string, updateCounterDto: Partial<CreateCounterDto>, ownerId: string): Promise<Counter> {
        const ownerIdObj = new Types.ObjectId(ownerId);
        const existingCounter = await this.counterRepository.findById(id);

        if (!existingCounter) {
            throw new BadRequestException('Counter not found');
        }

        if (existingCounter.ownerId.toString() !== ownerId) {
            throw new BadRequestException('You do not have permission to update this counter');
        }

        if (updateCounterDto.name && updateCounterDto.name !== existingCounter.name) {
            if (await this.counterRepository.checkExistence('name', updateCounterDto.name, ownerIdObj)) {
                throw new BadRequestException(`A counter with the name "${updateCounterDto.name}" already exists`);
            }
        }

        if (updateCounterDto.city && updateCounterDto.city !== existingCounter.city) {
            if (await this.counterRepository.checkExistence('city', updateCounterDto.city, ownerIdObj)) {
                throw new BadRequestException(`A counter in the city "${updateCounterDto.city}" already exists`);
            }
        }

        if (updateCounterDto.location && updateCounterDto.location !== existingCounter.location) {
            if (await this.counterRepository.checkExistence('location', updateCounterDto.location, ownerIdObj)) {
                throw new BadRequestException(`A counter at the location "${updateCounterDto.location}" already exists`);
            }
        }
        return this.counterRepository.update(id, updateCounterDto, ownerIdObj);
    }

    async deleteCounter(id: string, ownerId: string): Promise<Counter> {
        return this.counterRepository.delete(id, new Types.ObjectId(ownerId));
    }

    async findById(id: string | Types.ObjectId): Promise<Counter | null> {
        return this.counterRepository.findById(id);
    }
}