import { IsArray, IsOptional, IsString } from "class-validator";



export class UserDto {

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;
    
    @IsArray()
    @IsOptional() 
    @IsString({ each: true }) 
    tags?: string[]; 
}