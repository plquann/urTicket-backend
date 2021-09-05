import { ProductsModule } from './../products/products.module';
import { StripeModule } from './../stripe/stripe.module';
import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { MailModule } from 'src/mail/mail.module';
import { ShowtimesModule } from 'src/showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UsersModule,
    StripeModule,
    TicketsModule,
    MailModule,
    ShowtimesModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
