import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';

export interface ProcessedImage {
  main: Buffer;
  thumbnail: Buffer;
  width: number;
  height: number;
  mainSize: number;
  thumbSize: number;
}

@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);

  async process(input: Buffer): Promise<ProcessedImage> {
    // Main image: max 1920px wide, high quality JPEG, auto-rotate from EXIF
    const mainBuffer = await sharp(input)
      .rotate()
      .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    const mainMeta = await sharp(mainBuffer).metadata();

    // Thumbnail: 400x300 cover crop
    const thumbBuffer = await sharp(input)
      .rotate()
      .resize(400, 300, { fit: 'cover' })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();

    this.logger.log(
      `Processed image: ${(input.length / 1024).toFixed(0)}KB → main ${(mainBuffer.length / 1024).toFixed(0)}KB, thumb ${(thumbBuffer.length / 1024).toFixed(0)}KB`,
    );

    return {
      main: mainBuffer,
      thumbnail: thumbBuffer,
      width: mainMeta.width ?? 0,
      height: mainMeta.height ?? 0,
      mainSize: mainBuffer.length,
      thumbSize: thumbBuffer.length,
    };
  }
}
