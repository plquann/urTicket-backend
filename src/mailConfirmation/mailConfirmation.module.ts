import { MailConfirmationController } from './mailConfirmation.controller';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MailConfirmationService } from './mailConfirmation.service';

@Module({
  imports: [ConfigModule, MailModule, JwtModule.register({}), UsersModule],
  providers: [MailConfirmationService],
  exports: [MailConfirmationService],
  controllers: [MailConfirmationController],
})
export class MailConfirmationModule {}
