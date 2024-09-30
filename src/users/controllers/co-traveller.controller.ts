import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { CoTravellerService } from '../services/co-traveller.service';
import { CreateCoTravellerDto } from '../dto/co-traveller.dto';
import { CoTraveller } from '../schemas/co-traveller.schema';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';

@Controller('co-travellers')
export class CoTravellerController {
    constructor(private readonly coTravellerService: CoTravellerService) { }
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createCoTravellerDto: CreateCoTravellerDto, @Request() req) {
        console.log('Request user:', req.user); 
        const user = req.user as any;
        if (!user || !user.userId) {
            throw new Error('User not authenticated or userId not found');
        }
        createCoTravellerDto.userId = user.userId;
        console.log('CreateCoTravellerDto:', createCoTravellerDto); 
        return this.coTravellerService.create(createCoTravellerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() req): Promise<CoTraveller[]> {
        return this.coTravellerService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<CoTraveller> {
        return this.coTravellerService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCoTravellerDto: Partial<CreateCoTravellerDto>): Promise<CoTraveller> {
        return this.coTravellerService.update(id, updateCoTravellerDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<CoTraveller> {
        return this.coTravellerService.delete(id);
    }
}