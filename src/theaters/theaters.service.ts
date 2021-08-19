import { GroupTheater } from './../group-theater/entities/group-theater.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { theatersSeed } from 'src/database/seeds/theaters.seed';
import { Repository } from 'typeorm';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { Theater } from './entities/theater.entity';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async seedersTheaters(): Promise<void> {
    const theaters = theatersSeed;

    const result = await this.theaterRepository
      .createQueryBuilder()
      .insert()
      .into(Theater)
      .values(theaters)
      .execute();
    if (!result) {
      throw new HttpException(
        'Could not seed theaters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTheaters(): Promise<Theater[]> {
    const theaters = await this.theaterRepository.find();
    if (!theaters) {
      throw new HttpException('Theaters not found!', HttpStatus.NOT_FOUND);
    }
    return theaters;
  }

  create(createTheaterDto: CreateTheaterDto) {
    return 'This action adds a new theater';
  }

  findAll() {
    return `This action returns all theaters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} theater`;
  }

  update(id: number, updateTheaterDto: UpdateTheaterDto) {
    return `This action updates a #${id} theater`;
  }

  remove(id: number) {
    return `This action removes a #${id} theater`;
  }
}
