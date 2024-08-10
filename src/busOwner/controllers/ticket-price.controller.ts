import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { TicketPriceService } from '../services/ticket-price.service';
import { CreateTicketPriceDto } from '../dto/create-ticket-price.dto';
import { TicketPrice } from '../schemas/ticket-price.schema';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';

@Controller('ticket-prices')
@UseGuards(OwnerJwtAuthGuard)
export class TicketPriceController {
    constructor(private readonly ticketPriceService: TicketPriceService) { }

    @Post()
    async create(@Request() req, @Body() createTicketPriceDto: CreateTicketPriceDto): Promise<TicketPrice> {
        const ownerId = req.user.ownerId
        return this.ticketPriceService.create(createTicketPriceDto, ownerId);
    }

    @Get()
    async findAll(@Request() req): Promise<TicketPrice[]> {
        const ownerId = req.user.ownerId
        return this.ticketPriceService.findAll(ownerId);
    }
}