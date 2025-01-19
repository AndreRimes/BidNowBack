import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    console.log("FILES: ", files);

    if (!Array.isArray(files)) {
      files = [files];
    }
    
    files.forEach(file => {
      if (!file.mimetype) {
        throw new BadRequestException('File type is missing');
      }

      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        throw new BadRequestException('Invalid file type');
      }
    });

    return files;
  }
}