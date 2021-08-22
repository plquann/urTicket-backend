import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MovieClassification, MovieStatus } from 'src/constants';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  trailerVideoUrl: string;

  @IsString()
  @IsNotEmpty()
  posterUrl: string;

  @IsString()
  @IsNotEmpty()
  backdropUrl: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  language: string;

  @IsString()
  @IsOptional()
  @IsIn([
    MovieClassification.P,
    MovieClassification.C13,
    MovieClassification.C18,
  ])
  classify: MovieClassification;

  @IsString()
  @IsOptional()
  @IsIn([MovieStatus.OVER, MovieStatus.PLAYING, MovieStatus.UPCOMING])
  status: MovieStatus;

  @IsNumber()
  @IsOptional()
  voteAverage: number;

  @IsNumber()
  @IsOptional()
  voteCount: number;

  @IsArray()
  @IsNotEmpty()
  genresArr: string[];

  @IsArray()
  @IsNotEmpty()
  castsArr: string[];

  @IsArray()
  @IsNotEmpty()
  crewsArr: string[];
}
