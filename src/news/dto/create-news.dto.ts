import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  publishedDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;

  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @IsNumber()
  @IsNotEmpty()
  views: number;

  @IsObject()
  @IsNotEmpty()
  author: { name: string; introduction: string };

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];
}
