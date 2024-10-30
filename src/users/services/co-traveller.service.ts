import { Injectable } from '@nestjs/common';
import { CreateCoTravellerDto } from '../dto/co-traveller.dto';
import { CoTraveller } from '../schemas/co-traveller.schema';
import { CoTravellerRepository } from '../repositories/co-traveller.repository';
@Injectable()
export class CoTravellerService {
    constructor(private readonly coTravellerRepository: CoTravellerRepository) { }

    async create(createCoTravellerDto: CreateCoTravellerDto): Promise<CoTraveller> {
        return this.coTravellerRepository.create(createCoTravellerDto);
    }

    // async findAll(): Promise<CoTraveller[]> {
    //     return this.coTravellerRepository.findAll();
    // }

    async findAllPaginated(userId: string, page: number, limit: number): Promise<{ coTravellers: CoTraveller[], total: number }> {
        return this.coTravellerRepository.findAllPaginated(userId, page, limit);
    }

    async findByUserId(userId: string): Promise<CoTraveller[]> {
        return this.coTravellerRepository.findByUserId(userId);
    }

    async findById(id: string): Promise<CoTraveller> {
        return this.coTravellerRepository.findById(id);
    }

    async update(id: string, updateCoTravellerDto: Partial<CreateCoTravellerDto>): Promise<CoTraveller> {
        return this.coTravellerRepository.update(id, updateCoTravellerDto);
    }

    async delete(id: string): Promise<CoTraveller> {
        return this.coTravellerRepository.delete(id);
    }
}