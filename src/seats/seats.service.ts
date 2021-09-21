import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async getAll(): Promise<Seat[]> {
    const seats = await this.seatRepository.find();

    if (!seats) {
      throw new HttpException('No seats found', HttpStatus.NOT_FOUND);
    }

    return seats;
  }
}
