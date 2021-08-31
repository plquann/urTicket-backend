import { Ticket } from './entities/ticket.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Seat } from 'src/seats/entities/seat.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async createTickets(seats: Seat[], showtimeId: string): Promise<void> {
    const tickets: any[] = seats.map((seat) => {
      return {
        seat: seat.id,
        showtime: showtimeId,
        price: seat.type === 'NORMAL' ? 6 : seat.type === 'VIP' ? 10 : 15,
        reservation: null,
      };
    });

    const result = await this.ticketRepository
      .createQueryBuilder()
      .insert()
      .into(Ticket)
      .values(tickets)
      .execute();
  }

  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
