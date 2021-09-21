import { IsNotEmpty, IsDateString } from 'class-validator';

export class SeedShowtimeDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
