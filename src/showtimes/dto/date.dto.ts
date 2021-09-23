import { IsNotEmpty, IsDateString } from 'class-validator';

export class DateDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
