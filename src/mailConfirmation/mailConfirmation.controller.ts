import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MailConfirmationDto from './dtos/mail-confirm.dto';
import { MailConfirmationService } from './mailConfirmation.service';

@Controller('mail-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class MailConfirmationController {
  constructor(
    private readonly mailConfirmationService: MailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: MailConfirmationDto) {
    const email = await this.mailConfirmationService.decodeVerificationToken(
      confirmationData.token,
    );
    await this.mailConfirmationService.confirmMail(email);
  }

  @Post('resend-confirm-link')
  @UseGuards(JwtAuthenticationGuard)
  async resendConfirmLink(@Req() request: RequestWithUser) {
    await this.mailConfirmationService.resendConfirmationEmail(request.user.id);
  }
}
