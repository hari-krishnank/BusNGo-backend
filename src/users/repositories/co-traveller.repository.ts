import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCoTravellerDto } from '../dto/co-traveller.dto';
import { CoTraveller } from '../schemas/co-traveller.schema';
import { ICoTravellerRepository } from '../interfaces/co-traveller-repository.interface';

@Injectable()
export class CoTravellerRepository implements ICoTravellerRepository {
    constructor(
        @InjectModel(CoTraveller.name) private coTravellerModel: Model<CoTraveller>,
    ) { }

    async create(createCoTravellerDto: CreateCoTravellerDto): Promise<CoTraveller> {
        console.log('Creating CoTraveller with:', createCoTravellerDto);
        const createdCoTraveller = new this.coTravellerModel({
            ...createCoTravellerDto,
            userId: new Types.ObjectId(createCoTravellerDto.userId),
        });
        return createdCoTraveller.save();
    }

    async findAll(): Promise<CoTraveller[]> {
        return this.coTravellerModel.find().exec();
    }

    async findAllPaginated(userId: string, page: number, limit: number): Promise<{ coTravellers: CoTraveller[], total: number }> {
        const skip = (page - 1) * limit;
        const [coTravellers, total] = await Promise.all([
            this.coTravellerModel.find({ userId: new Types.ObjectId(userId) })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.coTravellerModel.countDocuments({ userId: new Types.ObjectId(userId) })
        ]);
        return { coTravellers, total };
    }

    async findByUserId(userId: string): Promise<CoTraveller[]> {
        return this.coTravellerModel.find({ userId }).exec();
    }

    async findById(id: string): Promise<CoTraveller> {
        return this.coTravellerModel.findById(id).exec();
    }

    async update(id: string, updateCoTravellerDto: Partial<CreateCoTravellerDto>): Promise<CoTraveller> {
        return this.coTravellerModel.findByIdAndUpdate(id, updateCoTravellerDto, { new: true }).exec();
    }

    async delete(id: string): Promise<CoTraveller> {
        return this.coTravellerModel.findByIdAndDelete(id).exec();
    }
}