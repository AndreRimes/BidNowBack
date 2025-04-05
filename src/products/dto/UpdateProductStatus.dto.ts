import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateProductStatusDto {
  @IsEnum(Status, { message: 'status must be a valid Status enum value' })
  status: Status;
}
