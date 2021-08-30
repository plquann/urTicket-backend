import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { seatsSeed } from 'src/database/seeds/seats.seed';
import { Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async seedersSeats(): Promise<void> {
    const seat = seatsSeed;

    const result = await this.seatRepository
      .createQueryBuilder()
      .insert()
      .into(Seat)
      .values(seat)
      .execute();

    if (!result)
      throw new HttpException(
        'Could not seed Seats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  async getSeatsByTheaterId(theaterId: string, room: string): Promise<Seat[]> {
    const seats = await this.seatRepository.find({
      theaterId,
      room,
    });

    if (!seats.length)
      throw new HttpException(
        `Room ${room} of theater ${theaterId} have not seats!`,
        HttpStatus.NOT_FOUND,
      );

    return seats;
  }
}
