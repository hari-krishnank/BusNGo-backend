import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';

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
}