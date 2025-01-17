import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    
    files.forEach(file => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        throw new BadRequestException('Invalid file type');
      }
    });

    return files;
  }
}