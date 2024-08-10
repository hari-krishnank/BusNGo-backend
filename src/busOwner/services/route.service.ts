import { Injectable } from '@nestjs/common';
import { RouteRepository } from '../repositories/route.repository';
import { CounterService } from './counter.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { Route } from '../schemas/route.schema';
import { Types } from 'mongoose';

@Injectable()
export class RouteService {
    constructor(
        private readonly routeRepository: RouteRepository,
        private readonly counterService: CounterService
    ) { }

    async create(createRouteDto: CreateRouteDto, ownerId: string): Promise<Route> {
        await this.validateCounters(createRouteDto);
        const routeWithOwner = {
            ...createRouteDto,
              startingPoint: new Types.ObjectId(createRouteDto.startingPoint),
            endingPoint: new Types.ObjectId(createRouteDto.endingPoint),
            additionalStops: createRouteDto.additionalStops.map(id => new Types.ObjectId(id)),
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.routeRepository.create(routeWithOwner);
    }

    async findAll(ownerId: string): Promise<Route[]> {
        return this.routeRepository.findAll(new Types.ObjectId(ownerId));
    }

    private async validateCounters(createRouteDto: CreateRouteDto): Promise<void> {
        const counterIds = [
            createRouteDto.startingPoint,
            createRouteDto.endingPoint,
            ...createRouteDto.additionalStops
        ];

        for (const counterId of counterIds) {
            const counter = await this.counterService.findById(counterId);
            if (!counter) {
                throw new Error(`Counter with id ${counterId} not found`);
            }
        }
    }
}