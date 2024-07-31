import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Counter } from '../schemas/counter.schema';
import { CreateCounterDto } from '../dto/create-counter.dto';

@Injectable()
export class CounterRepository {
    constructor(
        @InjectModel(Counter.name) private counterModel: Model<Counter>,
    ) { }

    async create(createCounterDto: CreateCounterDto): Promise<Counter> {
        const createdCounter = new this.counterModel(createCounterDto);
        return createdCounter.save();
    }

    async findAll(): Promise<Counter[]> {
        return this.counterModel.find().exec();
    }

    async update(id: string, updateCounterDto: Partial<CreateCounterDto>): Promise<Counter> {
        return this.counterModel.findByIdAndUpdate(id, updateCounterDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Counter> {
        return this.counterModel.findByIdAndDelete(id).exec();
    }

    async findById(id: string | Types.ObjectId): Promise<Counter | null> {
        return this.counterModel.findById(id).exec();
    }
}