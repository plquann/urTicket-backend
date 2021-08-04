import { IsNotEmpty, IsString } from 'class-validator';

export class MailConfirmationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default MailConfirmationDto;
