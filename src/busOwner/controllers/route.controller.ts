import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RouteService } from '../services/route.service';
import { CreateRouteDto } from '../dto/create-route.dto';
import { Route } from '../schemas/route.schema';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('routes')
@UseGuards(OwnerJwtAuthGuard)
export class RouteController {
    constructor(private readonly routeService: RouteService) { }

    @Post()
    async create(@Request() req, @Body() createRouteDto: CreateRouteDto): Promise<Route> {
        const ownerId = req.user.ownerId
        return this.routeService.create(createRouteDto, ownerId);
    }

    @Get()
    async findAll(@Request() req): Promise<Route[]> {
        const ownerId = req.user.ownerId
        return this.routeService.findAll(ownerId);
    }
}