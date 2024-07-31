import { Controller, Get, Post, Body } from '@nestjs/common';
import { TicketPriceService } from '../services/ticket-price.service';
import { CreateTicketPriceDto } from '../dto/create-ticket-price.dto';
import { TicketPrice } from '../schemas/ticket-price.schema';

@Controller('ticket-prices')
export class TicketPriceController {
    constructor(private readonly ticketPriceService: TicketPriceService) { }

    @Post()
    async create(@Body() createTicketPriceDto: CreateTicketPriceDto): Promise<TicketPrice> {
        return this.ticketPriceService.create(createTicketPriceDto);
    }

    @Get()
    async findAll(): Promise<TicketPrice[]> {
        return this.ticketPriceService.findAll();
    }
}