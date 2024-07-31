import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from '../schemas/schedule.schema';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleRepository {
    constructor(@InjectModel(Schedule.name) private scheduleModel: Model<Schedule>) { }

    async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
        const newSchedule = new this.scheduleModel(createScheduleDto);
        return newSchedule.save();
    }

    async findAll(): Promise<Schedule[]> {
        return this.scheduleModel.find().exec();
    }

    async findOne(id: string): Promise<Schedule> {
        return this.scheduleModel.findById(id).exec();
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
        return this.scheduleModel.findByIdAndUpdate(id, updateScheduleDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Schedule> {
        return this.scheduleModel.findByIdAndDelete(id).exec();
    }
}