import { Injectable } from '@nestjs/common';
import { TicketPriceRepository } from '../repositories/ticket-price.repository';
import { CreateTicketPriceDto } from '../dto/create-ticket-price.dto';
import { TicketPrice } from '../schemas/ticket-price.schema';

@Injectable()
export class TicketPriceService {
    constructor(private readonly ticketPriceRepository: TicketPriceRepository) { }

    async create(createTicketPriceDto: CreateTicketPriceDto): Promise<TicketPrice> {
        return this.ticketPriceRepository.create(createTicketPriceDto);
    }

    async findAll(): Promise<TicketPrice[]> {
        return this.ticketPriceRepository.findAll();
    }
}