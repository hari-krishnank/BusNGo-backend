import { Injectable } from '@nestjs/common';
import { TicketPriceRepository } from '../repositories/ticket-price.repository';
import { CreateTicketPriceDto } from '../dto/create-ticket-price.dto';
import { TicketPrice } from '../schemas/ticket-price.schema';
import { Types } from 'mongoose';

@Injectable()
export class TicketPriceService {
    constructor(private readonly ticketPriceRepository: TicketPriceRepository) { }

    async create(createTicketPriceDto: CreateTicketPriceDto, ownerId: string): Promise<TicketPrice> {
        const ticketPriceWithOwner = {
            ...createTicketPriceDto,
            ownerId: new Types.ObjectId(ownerId)
        }
        return this.ticketPriceRepository.create(ticketPriceWithOwner);
    }

    async findAll(ownerId: string): Promise<TicketPrice[]> {
        return this.ticketPriceRepository.findAll(new Types.ObjectId(ownerId));
    }
}