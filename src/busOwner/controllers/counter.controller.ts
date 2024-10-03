import { Controller, Get, Post, Body, Delete, Param, Put, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { CounterService } from '../services/counter.service';
import { CreateCounterDto } from '../dto/create-counter.dto';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';
import { CheckOwnerBlocked } from 'src/utils/decorators/checkBlockStatus/checkOwner.decoreator';

@Controller('counters')
@UseGuards(OwnerJwtAuthGuard)
export class CounterController {
    constructor(private readonly counterService: CounterService) { }

    @CheckOwnerBlocked()
    @Post()
    async createCounter(@Request() req, @Body() createCounterDto: CreateCounterDto) {
        const ownerId = req.user.ownerId
        console.log('Received counter data:', createCounterDto);
        console.log('Creating counter for owner', ownerId);

        try {
            return await this.counterService.createCounter(createCounterDto, ownerId);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('An error occurred while creating the counter');
        }
    }

    @CheckOwnerBlocked()
    @Get()
    async getAllCounters(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5
    ) {
        const ownerId = req.user.ownerId;
        return this.counterService.getAllCounters(ownerId, page, limit);
    }

    @CheckOwnerBlocked()
    @Put(':id')
    async updateCounter(@Request() req, @Param('id') id: string, @Body() updateCounterDto: Partial<CreateCounterDto>) {
        const ownerId = req.user.ownerId
        return this.counterService.updateCounter(id, updateCounterDto, ownerId);
    }

    @CheckOwnerBlocked()
    @Delete(':id')
    async deleteCounter(@Request() req, @Param('id') id: string) {
        const ownerId = req.user.ownerId
        return this.counterService.deleteCounter(id, ownerId);
    }
}