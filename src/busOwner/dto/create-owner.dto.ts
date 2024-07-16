import { IsEmail, IsBoolean } from 'class-validator';
import { IOwner } from '../interfaces/owner.interface';

export class CreateOwnerDto implements IOwner {

    @IsEmail()
    email: string;;

    @IsBoolean()
    is_verified: boolean;

    
}