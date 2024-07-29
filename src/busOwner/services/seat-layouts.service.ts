import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SeatLayout } from '../interfaces/seat-layout.interface';
import { CreateSeatLayoutDto } from '../dto/create-seat-layout.dto';
import { UpdateSeatLayoutDto } from '../dto/update-seat-layout.dto';

@Injectable()
export class SeatLayoutsService {
    constructor(@InjectModel('SeatLayout') private seatLayoutModel: Model<SeatLayout>) { }

    // async create(createSeatLayoutDto: CreateSeatLayoutDto): Promise<SeatLayout> {
    //     const createdSeatLayout = new this.seatLayoutModel(createSeatLayoutDto);
    //     return createdSeatLayout.save();
    // }

    async create(createSeatLayoutDto: CreateSeatLayoutDto): Promise<SeatLayout> {
        console.log('Received DTO:', createSeatLayoutDto);
        const createdSeatLayout = new this.seatLayoutModel(createSeatLayoutDto);
        return createdSeatLayout.save();
    }

    async findAll(): Promise<SeatLayout[]> {
        return this.seatLayoutModel.find().exec();
    }

    async findOne(id: string): Promise<SeatLayout> {
        return this.seatLayoutModel.findById(id).exec();
    }

    async update(id: string, updateSeatLayoutDto: UpdateSeatLayoutDto): Promise<SeatLayout> {
        return this.seatLayoutModel.findByIdAndUpdate(id, updateSeatLayoutDto, { new: true }).exec();
    }

    async remove(id: string): Promise<SeatLayout> {
        return this.seatLayoutModel.findByIdAndDelete(id).exec();
    }
}