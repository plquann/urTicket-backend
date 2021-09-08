import {
  Body,
  Req,
  Controller,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { MailConfirmationService } from './../mailConfirmation/mailConfirmation.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailConfirmationService: MailConfirmationService,
  ) {}
  
  @ApiCreatedResponse()
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    const user = await this.authService.register(registerData);
    await this.mailConfirmationService.sendVerificationEmail(
      registerData.email,
    );

    return user;
  }

  @ApiOkResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser, @Body() loginData: LoginDto) {
    console.log('🚀 ~ file: auth.controller.ts ~ line 43 ~ request', request);
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;
  }

  @ApiOkResponse()
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @ApiOkResponse()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
