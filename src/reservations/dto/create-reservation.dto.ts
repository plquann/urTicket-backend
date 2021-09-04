import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

type ProductList = {
  productId: string;
  quantity: number;
};
export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  showtimeId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tickets: string[];

  @IsOptional()
  @IsString()
  promotionId: string;

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  product: ProductList[];
}
