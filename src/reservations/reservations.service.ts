import { Ticket } from 'src/tickets/entities/ticket.entity';
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
import { mailReservationTemplate } from 'src/common/mailHtmlTemplate';
import MailService from 'src/mail/mail.service';

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
    private readonly mailService: MailService,
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
      products = [],
    } = createReservationDto;
    console.log(
      '🚀 ~ file: reservations.service.ts ~ line 42 ~ products',
      products,
    );

    const user = await this.usersService.getUserById(userId);
    const convertAmount = amount * 100;
    //stripe charge
    const paymentIndent = await this.stripeService.charge(
      convertAmount,
      paymentMethodId,
      user.stripeCustomerId,
    );
    console.log(
      '🚀 ~ file: reservations.service.ts ~ line 49 ~ paymentIndent',
      paymentIndent,
    );

    if (paymentIndent.status !== 'succeeded') {
      throw new HttpException(
        'Payment Failure!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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

      // update products
      if (products.length) {
        for (const product of products)
          await queryRunner.manager.save(ProductOrder, {
            reservationId: reservation.id,
            productId: product.productId,
            quantity: product.quantity,
          });
      }

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
    await this.sendMailReservation(reservation, user.email);

    return reservation;
  }

  async sendMailReservation(reservation: Reservation, email: string) {
    const showtime = await this.showtimesService.getShowtimeById(
      reservation.showtimeId,
    );
    console.log(
      '🚀 ~ file: reservations.service.ts ~ line 111 ~ showtime',
      showtime,
    );

    const tickets = await this.ticketsService.getTicketsByReservation(
      reservation.id,
    );

    const products = await this.connection
      .getRepository(ProductOrder)
      .createQueryBuilder('productOrder')
      .innerJoinAndSelect('productOrder.product', 'product')
      .where('productOrder.reservationId = :reservationId', {
        reservationId: reservation.id,
      })
      .getMany();

    // console.log(
    //   '🚀 ~ file: reservations.service.ts ~ line 114 ~ products',
    //   products,
    // );

    const ticketString = tickets
      .map((ticket) => `${ticket.seat.row}${ticket.seat.column}`)
      .join(', ');
    // console.log(
    //   '🚀 ~ file: reservations.service.ts ~ line 113 ~ ticketString',
    //   ticketString,
    // );

    const productsString = products
      .map((product) => `${product.quantity}x ${product.product.name}`)
      .join(', ');
    // console.log(
    //   '🚀 ~ file: reservations.service.ts ~ line 121 ~ productsString',
    //   productsString,
    // );

    const html = mailReservationTemplate(reservation, showtime, ticketString);
    console.log('send mail');

    return this.mailService.sendMail({
      from: '"UR-TICKET 🎉✨🎉" <bookingmovie.application@gmail.com>',
      to: email,
      subject: 'Booking Movie Platform - Reservation Information',
      html,
    });
  }
}
