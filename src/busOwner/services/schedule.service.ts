import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
import { Schedule } from '../schemas/schedule.schema';
import { Types } from 'mongoose';

@Injectable()
export class ScheduleService {
  constructor(private scheduleRepository: ScheduleRepository) { }

  async create(createScheduleDto: CreateScheduleDto, ownerId: string): Promise<Schedule> {
    const scheduleWithOwner = {
      ...createScheduleDto,
      ownerId: new Types.ObjectId(ownerId)
    }
    return this.scheduleRepository.create(scheduleWithOwner);
  }

  async findAll(ownerId: string): Promise<Schedule[]> {
    return this.scheduleRepository.findAll(new Types.ObjectId(ownerId));
  }

  async findOne(id: string, ownerId: string): Promise<Schedule> {
    return this.scheduleRepository.findOne(id, new Types.ObjectId(ownerId));
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto, ownerId: string): Promise<Schedule> {
    return this.scheduleRepository.update(id, updateScheduleDto, new Types.ObjectId(ownerId));
  }

  async delete(id: string, ownerId: string): Promise<Schedule> {
    return this.scheduleRepository.delete(id, new Types.ObjectId(ownerId));
  }
}