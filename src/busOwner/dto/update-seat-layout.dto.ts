import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatLayoutDto } from './create-seat-layout.dto';

export class UpdateSeatLayoutDto extends PartialType(CreateSeatLayoutDto) { }