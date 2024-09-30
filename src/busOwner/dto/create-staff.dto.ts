import { IsEmail, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateStaffDto {
    @IsNotEmpty()
    @IsString()
    username: string
  
    @IsNotEmpty()
    @IsString()
    mobile: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsMongoId()
    bus: string;
}