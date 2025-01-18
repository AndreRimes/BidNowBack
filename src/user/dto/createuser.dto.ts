import { IsArray, IsOptional, IsString } from "class-validator";



export class UserDto {
    name: string;
    email: string;
    password: string;
    
    @IsArray()
    @IsOptional() 
    @IsString({ each: true }) 
    tags?: string[]; 
}