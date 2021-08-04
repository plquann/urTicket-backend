import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports :[ConfigModule, MailModule, JwtModule.register({}), UsersModule],
    providers: [],
    exports: [],
    controllers: [],
})

export class MailConfirmationModule { }
