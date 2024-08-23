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

    async create(createCounterDto: CreateCounterDto & { ownerId: Types.ObjectId }): Promise<Counter> {
        const createdCounter = new this.counterModel(createCounterDto);
        return createdCounter.save();
    }

    async findAllPaginated(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ counters: Counter[], total: number }> {
        const [counters, total] = await Promise.all([
            this.counterModel.find({ ownerId }).skip(skip).limit(limit).exec(),
            this.counterModel.countDocuments({ ownerId })
        ]);
        return { counters, total }; 
    }

    async update(id: string, updateCounterDto: Partial<CreateCounterDto>, ownerId: Types.ObjectId): Promise<Counter> {
        return this.counterModel.findByIdAndUpdate({ _id: id, ownerId }, updateCounterDto, { new: true }).exec();
    }

    async delete(id: string, ownerId: Types.ObjectId): Promise<Counter> {
        return this.counterModel.findByIdAndDelete({ _id: id, ownerId }).exec();
    }

    async findById(id: string | Types.ObjectId): Promise<Counter | null> {
        return this.counterModel.findById(id).exec();
    }
}