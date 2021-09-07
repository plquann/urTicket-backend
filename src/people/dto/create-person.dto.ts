import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsOptional()
  position?: string;
}

export default CreatePersonDto;
