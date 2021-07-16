import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
