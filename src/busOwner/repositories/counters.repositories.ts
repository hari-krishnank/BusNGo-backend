import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}