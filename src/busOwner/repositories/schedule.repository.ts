import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schemas/schedule.schema';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleRepository {
    constructor(@InjectModel(Schedule.name) private scheduleModel: Model<Schedule>) { }

    async create(createScheduleDto: CreateScheduleDto & { ownerId: Types.ObjectId }): Promise<Schedule> {
        const newSchedule = new this.scheduleModel(createScheduleDto);
        return newSchedule.save();
    }

    async findAll(ownerId: Types.ObjectId, skip: number, limit: number): Promise<{ schedules: Schedule[], total: number }> {
        const [schedules, total] = await Promise.all([
            this.scheduleModel.find({ ownerId }).skip(skip).limit(limit).exec(),
            this.scheduleModel.countDocuments({ ownerId })
        ])
        return { schedules, total }
    }
 
    async findOne(id: string, ownerId: Types.ObjectId): Promise<Schedule> {
        return this.scheduleModel.findById({ _id: id, ownerId }).exec();
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDto, ownerId: Types.ObjectId): Promise<Schedule> {
        return this.scheduleModel.findByIdAndUpdate({ _id: id, ownerId }, updateScheduleDto, { new: true }).exec();
    }

    async delete(id: string, ownerId: Types.ObjectId): Promise<Schedule> {
        return this.scheduleModel.findByIdAndDelete({ _id: id, ownerId }).exec();
    }
}