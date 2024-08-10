import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SeatLayout } from '../interfaces/seat-layout.interface';
import { CreateSeatLayoutDto } from '../dto/create-seat-layout.dto';
import { UpdateSeatLayoutDto } from '../dto/update-seat-layout.dto';

@Injectable()
export class SeatLayoutsService {
    constructor(@InjectModel('SeatLayout') private seatLayoutModel: Model<SeatLayout>) { }

    async create(createSeatLayoutDto: CreateSeatLayoutDto & { ownerId: Types.ObjectId }): Promise<SeatLayout> {
        console.log('Received DTO:', createSeatLayoutDto);
        const createdSeatLayout = new this.seatLayoutModel(createSeatLayoutDto);
        return createdSeatLayout.save();
    }

    async findAll(ownerId: Types.ObjectId): Promise<SeatLayout[]> {
        return this.seatLayoutModel.find({ ownerId }).exec();
    }

    async findOne(id: string, ownerId: Types.ObjectId): Promise<SeatLayout> {
        return this.seatLayoutModel.findById({ _id: id, ownerId }).exec();
    }

    async update(id: string, updateSeatLayoutDto: UpdateSeatLayoutDto, ownerId: Types.ObjectId): Promise<SeatLayout> {
        return this.seatLayoutModel.findByIdAndUpdate({ _id: id, ownerId }, updateSeatLayoutDto, { new: true }).exec();
    }

    async remove(id: string, ownerId: Types.ObjectId): Promise<SeatLayout> {
        return this.seatLayoutModel.findByIdAndDelete({ _id: id, ownerId }).exec();
    }
}