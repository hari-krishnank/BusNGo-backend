import { Injectable } from '@nestjs/common';
import { RouteRepository } from '../repositories/route.repository';
import { CounterService } from './counter.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { Route } from '../schemas/route.schema';
import { Types } from 'mongoose';

@Injectable()
export class RouteService {
    constructor(private readonly routeRepository: RouteRepository, private readonly counterService: CounterService) { }

    async create(createRouteDto: CreateRouteDto, ownerId: string): Promise<Route> {
        await this.validateCounters(createRouteDto);
        const routeWithOwner = {
            ...createRouteDto,
            schedule: new Types.ObjectId(createRouteDto.schedule),
            startingPoint: new Types.ObjectId(createRouteDto.startingPoint),
            endingPoint: new Types.ObjectId(createRouteDto.endingPoint),
            additionalStops: createRouteDto.additionalStops.map(stop => ({
                stop: new Types.ObjectId(stop.stop),
                reachingTime: stop.reachingTime
            })),
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.routeRepository.create(routeWithOwner);
    }

    async findAll(ownerId: string, page: number, limit: number): Promise<{ routes: Route[], total: number }> {
        const skip = (page - 1) * limit;
        return this.routeRepository.findAll(new Types.ObjectId(ownerId), skip, limit);
    }

    private async validateCounters(createRouteDto: CreateRouteDto): Promise<void> {
        const counterIds = [
            createRouteDto.startingPoint,
            createRouteDto.endingPoint,
            ...createRouteDto.additionalStops.map(stop => stop.stop)
        ];

        for (const counterId of counterIds) {
            const counter = await this.counterService.findById(counterId);
            if (!counter) {
                throw new Error(`Counter with id ${counterId} not found`);
            }
        }
    }
}