import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from './entities/theater.entity';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async getAllTheaters(): Promise<Theater[]> {
    const theaters = await this.theaterRepository.find();
    if (!theaters) {
      throw new HttpException('Theaters not found!', HttpStatus.NOT_FOUND);
    }
    return theaters;
  }

  async getTheaterById(id: string): Promise<Theater> {
    const theater = await this.theaterRepository.findOne(id);

    if (!theater) {
      throw new HttpException('Theater not found!', HttpStatus.NOT_FOUND);
    }
    return theater;
  }

  async getSeatsByTheaterIdAndRoom(
    theaterId: string,
    room: string,
  ): Promise<any> {
    const result = await this.theaterRepository
      .createQueryBuilder('theater')
      .leftJoinAndSelect('theater.seats', 'seats')
      .where('theater.id = :id', { id: theaterId })
      .andWhere('seats.room = :room', { room: room })
      .getOne();

    if (!result) {
      throw new HttpException(
        `Seats not found in rom ${room} of theater ${theaterId}!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result.seats;
  }
}
