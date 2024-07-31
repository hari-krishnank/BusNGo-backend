import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketPrice } from '../schemas/ticket-price.schema';
import { CreateTicketPriceDto } from '../dto/create-ticket-price.dto';

@Injectable()
export class TicketPriceRepository {
    constructor(
        @InjectModel(TicketPrice.name) private ticketPriceModel: Model<TicketPrice>,
    ) { }

    async create(createTicketPriceDto: CreateTicketPriceDto): Promise<TicketPrice> {
        const createdTicketPrice = new this.ticketPriceModel(createTicketPriceDto);
        return createdTicketPrice.save();
    }

    async findAll(): Promise<TicketPrice[]> {
        return this.ticketPriceModel.find().populate('fleetType').populate('route').exec();
    }
}