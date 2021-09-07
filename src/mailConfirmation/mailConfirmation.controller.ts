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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Mail Confirmation')
@Controller('mail-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class MailConfirmationController {
  constructor(
    private readonly mailConfirmationService: MailConfirmationService,
  ) {}

  @ApiCreatedResponse()
  @Post('confirm')
  async confirm(@Body() confirmationData: MailConfirmationDto) {
    const email = await this.mailConfirmationService.decodeVerificationToken(
      confirmationData.token,
    );
    await this.mailConfirmationService.confirmMail(email);
  }

  @ApiOkResponse()
  @Post('resend-confirm-link')
  @UseGuards(JwtAuthenticationGuard)
  async resendConfirmLink(@Req() request: RequestWithUser) {
    await this.mailConfirmationService.resendConfirmationEmail(request.user.id);
  }
}
