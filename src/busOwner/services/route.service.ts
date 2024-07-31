import { Injectable } from '@nestjs/common';
import { RouteRepository } from '../repositories/route.repository';
import { CounterService } from './counter.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { Route } from '../schemas/route.schema';

@Injectable()
export class RouteService {
    constructor(
        private readonly routeRepository: RouteRepository,
        private readonly counterService: CounterService
    ) { }

    async create(createRouteDto: CreateRouteDto): Promise<Route> {
        await this.validateCounters(createRouteDto);
        return this.routeRepository.create(createRouteDto);
    }

    async findAll(): Promise<Route[]> {
        return this.routeRepository.findAll();
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