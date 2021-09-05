import { Showtime } from './../showtimes/entities/showtime.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StripeService from 'src/stripe/stripe.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ProductOrder } from 'src/products/entities/productOrder.entity';
import { ShowtimesService } from 'src/showtimes/showtimes.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly stripeService: StripeService,
    private readonly ticketsService: TicketsService,
    private readonly showtimesService: ShowtimesService,
    private readonly productsService: ProductsService,
  ) {}

  async createReservation(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const {
      paymentMethodId,
      amount,
      showtimeId,
      tickets,
      promotionId,
      products,
    } = createReservationDto;

    const user = await this.usersService.getUserById(userId);

    //stripe charge
    const paymentIndent = await this.stripeService.charge(
      amount,
      paymentMethodId,
      user.stripeCustomerId,
    );

    let reservation: Reservation;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // execute some operations on this transaction
      //create reservation
      reservation = await queryRunner.manager.save(Reservation, {
        amount,
        showtimeId,
        userId: user.id,
      });

      //update tickets
      for (const ticketId of tickets)
        await queryRunner.manager.update(Ticket, ticketId, {
          reservationId: reservation.id,
        });

      //update products
      for (const product of products)
        await queryRunner.manager.save(ProductOrder, {
          reservationId: reservation.id,
          productId: product.productId,
          quantity: product.quantity,
        });

      // commit transaction now
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('🚀 ~ file: reservations.service.ts ~ line 46 ~ e', error);

      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      // you need to release query runner which is manually created
      await queryRunner.release();
    }

    //send email

    return reservation;
  }

  async sendMailReservation(reservation: Reservation) {
    const showtime = this.showtimesService.getShowtimeById(
      reservation.showtimeId,
    );

    const tickets = await this.ticketsService.getTicketsByReservation(
      reservation.id,
    );

    const products = await this.productsService.getProductsByReservationId(
      reservation.id,
    );

    const ticketString = tickets
      .map((ticket) => `${ticket.seat.row}${ticket.seat.column}`)
      .join(', ');

    const productsString = products
      .map((product) => `${product.quantity}x ${product.product.name}`)
      .join(', ');
  }
}
