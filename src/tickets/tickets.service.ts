import { Ticket } from './entities/ticket.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Seat } from 'src/seats/entities/seat.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private connection: Connection,
  ) {}

  async createTickets(seats: Seat[], showtimeId: string): Promise<void> {
    const tickets: any[] = seats.map((seat) => {
      return {
        seat: seat.id,
        showtimeId: showtimeId,
        price: seat.type === 'NORMAL' ? 6 : seat.type === 'VIP' ? 10 : 15,
        reservation: null,
      };
    });

    await this.ticketRepository
      .createQueryBuilder()
      .insert()
      .into(Ticket)
      .values(tickets)
      .execute();
  }
  async getTicketsByShowtime(showtimeId: string) {
    const tickets = await this.ticketRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.seat', 'seat')
      .where('tickets.showtime = :showtimeId', { showtimeId })
      .orderBy({
        'seat.row': 'ASC',
        'seat.column': 'ASC',
      })
      .getMany();

    return tickets;
  }

  async getTicketsByReservation(reservationId: string): Promise<Ticket[]> {
    const tickets = await this.ticketRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.seat', 'seat')
      .where('tickets.reservation = :reservationId', { reservationId })
      .getMany();

    return tickets;
  }

  async getTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository
      .createQueryBuilder('tickets')
      .where('tickets.id = :id', { id })
      .getOne();

    return ticket;
  }

  async destroyTicketsWithNoReservationId(): Promise<any> {
    const date = new Date();

    const tickets = await this.ticketRepository
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.showtime', 'showtime')
      .where('tickets.reservationId is null')
      .andWhere('showtime.startTime < :date', { date })
      .getMany();

    const ticketIds = tickets.map((ticket) => ticket.id);

    await this.connection
      .createQueryBuilder()
      .delete()
      .from(Ticket)
      .where('id IN (:...ids)', { ids: ticketIds })
      .execute();
  }
}
