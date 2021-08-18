import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export default CreateProductDto;
