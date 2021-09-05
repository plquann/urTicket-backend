import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  avatar: string;

  @IsString()
  position?: string;
}

export default CreatePersonDto;
