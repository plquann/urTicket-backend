import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StripeService from 'src/stripe/stripe.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly stripeService: StripeService,
    private readonly ticketsService: TicketsService,
  ) {}

  async createReservation(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<any> {
    const {
      paymentMethodId,
      amount,
      showtimeId,
      tickets,
      promotionId,
      product,
    } = createReservationDto;

    const user = await this.usersService.getUserById(userId);
    //charge => create reservation => update ticket => send email
  }
}
