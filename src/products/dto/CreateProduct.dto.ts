import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  minimalPrice: string;

  @IsString()
  @IsNotEmpty()
  files: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
