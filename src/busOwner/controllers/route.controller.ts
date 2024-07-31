import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RouteService } from '../services/route.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { Route } from '../schemas/route.schema';

@Controller('routes')
export class RouteController {
    constructor(private readonly routeService: RouteService) { }

    @Post()
    async create(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
        return this.routeService.create(createRouteDto);
    }

    @Get()
    async findAll(): Promise<Route[]> {
        return this.routeService.findAll();
    }
}