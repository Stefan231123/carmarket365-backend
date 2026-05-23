import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly config: ConfigService) {
    this.region = config.getOrThrow<string>('AWS_REGION');
    this.bucket = config.getOrThrow<string>('AWS_S3_BUCKET');
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async getPresignedUploadUrl(
    carId: string,
    fileName: string,
  ): Promise<{ uploadUrl: string; key: string }> {
    const ext = (fileName.split('.').pop() || 'jpg').toLowerCase();
    const key = `uploads/${carId}/${uuidv4()}.${ext}`;
    const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 300 });
    return { uploadUrl, key };
  }

  async getObject(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const response = await this.client.send(command);
    const stream = response.Body as NodeJS.ReadableStream;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async putObject(key: string, body: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await this.client.send(command);
    return this.getPublicUrl(key);
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
