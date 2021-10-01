import { GroupTheater } from 'src/group-theater/entities/group-theater.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TheatersService } from 'src/theaters/theaters.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { Connection, Repository } from 'typeorm';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import * as dayjs from 'dayjs';
import { showtimesSeed } from 'src/database/seeds/showtime.seed';
import { DateDto } from './dto/date.dto';
import { getSkipLimit } from 'src/common/utils';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    private readonly theaterService: TheatersService,
    private readonly ticketService: TicketsService,
    private connection: Connection,
  ) {}

  async seedersShowtimes(dateDto: DateDto) {
    const seedShowtimes = showtimesSeed(dateDto.date);

    for (const showtime of seedShowtimes) {
      await this.createShowtime({
        ...showtime,
        startTime: new Date(showtime.startTime),
      });
    }
  }

  async getShowtimeById(showtimeId: string): Promise<Showtime> {
    const showtime = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.theater', 'theater')
      .where('showtime.id = :showtimeId', { showtimeId })
      .getOne();

    if (!showtime) {
      throw new HttpException('Showtime not found', HttpStatus.NOT_FOUND);
    }
    return showtime;
  }

  async getShowtimesByMovieId(movieId: string, date?: string): Promise<any[]> {
    let currentDate = new Date();
    let start;
    let end;

    if (date) {
      currentDate = new Date(date);
      start = dayjs(currentDate).startOf('day').add(8, 'hour').toDate();
      end = dayjs(currentDate).endOf('day').add(8, 'hour').toDate();
    } else {
      start = dayjs(currentDate).toDate();
      end = dayjs(currentDate).endOf('day').add(8, 'hour').toDate();
    }
    //get All GroupTheater --> join theater --> join showtime --> where showtime.movieId = movieId
    const result = await this.connection
      .getRepository(GroupTheater)
      .createQueryBuilder('groupTheater')
      .leftJoinAndSelect('groupTheater.theaters', 'theaters')
      .leftJoinAndSelect('theaters.showtimes', 'showtimes')
      .where('showtimes.movieId = :movieId', { movieId })
      .andWhere('showtimes.startTime >= :start AND showtimes.endTime <= :end', {
        start,
        end,
      })
      .getMany();

    return result;
  }

  async getShowtimesByTheaterId(theaterId: string): Promise<Movie[]> {
    const currentDay = new Date();

    const start = dayjs(currentDay).toDate();
    const end = dayjs(currentDay).endOf('day').add(8, 'hour').toDate();
    // console.log('🚀 ~ file: showtimes.service.ts  ~ start', start);
    // console.log('🚀 ~ file: showtimes.service.ts  ~ end', end);

    const movies = await this.connection
      .getRepository(Movie)
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.showtimes', 'showtimes')
      .where('showtimes.theaterId = :theaterId', { theaterId })
      .andWhere('showtimes.startTime >= :start AND showtimes.endTime <= :end', {
        start,
        end,
      })
      .getMany();

    return movies;
  }

  async createShowtime(createShowtimeDto: CreateShowtimeDto): Promise<any> {
    const { movieId, theaterId, startTime, room } = createShowtimeDto;

    const movie = await this.connection.getRepository(Movie).findOne(movieId);
    const theater = await this.theaterService.getTheaterById(theaterId);

    if (!movie || !theater) {
      throw new HttpException(
        'Movie or theater not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (theater.rooms.indexOf(room) === -1) {
      throw new HttpException(
        `Room ${room} in Theater ${theaterId} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + movie.duration * 60000);

    const showtimes = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.theaterId = :theaterId', { theaterId })
      .andWhere('showtime.room = :room', { room })
      .andWhere('showtime.startTime < :end AND showtime.endTime > :start', {
        start,
        end: endTime,
      })
      .getMany();

    if (showtimes.length) {
      throw new HttpException(
        `Already have showtime in this time period!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const seats = await this.theaterService.getSeatsByTheaterIdAndRoom(
      theaterId,
      room,
    );

    let newShowtime: Showtime;

    const queryRunner = this.connection.createQueryRunner();

    try {
      newShowtime = await queryRunner.manager.save(Showtime, {
        movieId,
        theaterId,
        startTime,
        endTime,
        room,
      });

      await this.ticketService.createTickets(seats, newShowtime.id);
    } catch (error) {
      console.log('🚀 ~ file: showtimes.service.ts ~ line 151 ~ error', error);
      throw new HttpException(
        'Can not create showtime',
        HttpStatus.BAD_REQUEST,
      );
    }

    return newShowtime;
  }

  async getAllShowtimes(page: number, limit: number): Promise<any> {
    const pagination = getSkipLimit({ page, limit });

    const [showtimes, count] = await this.showtimeRepository.findAndCount({
      order: { startTime: 'DESC' },
      skip: pagination.skip,
      take: pagination.limit,
    });

    return showtimes;
  }
}
