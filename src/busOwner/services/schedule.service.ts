import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';
import { Schedule } from '../schemas/schedule.schema';

@Injectable()
export class ScheduleService {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleRepository.create(createScheduleDto);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.findAll();
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne(id);
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    return this.scheduleRepository.update(id, updateScheduleDto);
  }

  async delete(id: string): Promise<Schedule> {
    return this.scheduleRepository.delete(id);
  }
}