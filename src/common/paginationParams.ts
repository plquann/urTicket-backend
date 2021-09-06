import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
 
export class PaginationParams {
  @IsOptional()
  @IsString()
  startId?: string;
 
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}