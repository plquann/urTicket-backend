import { IsNotEmpty, IsString } from 'class-validator';

export class AddCardDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}

export default AddCardDto;
