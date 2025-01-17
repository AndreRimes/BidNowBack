import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'

@Injectable()
export class S3Service {
  private s3Client: S3Client
  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION })
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const bucket = process.env.AWS_S3_BUCKET

    return files.map((file: Express.Multer.File) => {
      const { buffer, mimetype } = file

      const key = randomBytes(20).toString('hex')


      this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key + `.${mimetype.split('/')[1]}`,
          Body: buffer,
          ContentType: mimetype,
          ACL: 'public-read',
        }),
      )

      return {
        key,
        url: `https://${bucket}.s3.amazonaws.com/${key}.${mimetype.split('/')[1]}`,
        name: file.originalname,
      }
    })
  }

  async uploadFile(file: Express.Multer.File) {
    const { buffer, mimetype } = file

    const bucket = process.env.AWS_S3_BUCKET

    const key = randomBytes(20).toString('hex')

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      }),
    )

    return {
      key,
      url: `https://${bucket}.s3.amazonaws.com/${key}`,
    }
  }

  async deleteFile(key: string) {
    const bucket = process.env.AWS_S3_BUCKET

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
  }
}