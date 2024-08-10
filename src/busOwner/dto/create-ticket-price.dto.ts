import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTicketPriceDto {
  @IsNotEmpty()
  @IsMongoId()
  fleetType: string;

  @IsNotEmpty()
  @IsMongoId()
  route: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsMongoId()
  ownerId: Types.ObjectId
}