import { GroupTheater } from 'src/group-theater/entities/group-theater.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieService } from 'src/movies/movie.service';
import { TheatersService } from 'src/theaters/theaters.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { Connection, Repository } from 'typeorm';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    private readonly movieService: MovieService,
    private readonly theaterService: TheatersService,
    private readonly ticketService: TicketsService,
    private connection: Connection,
  ) {}

  async getShowtimesByMovieId(movieId: string): Promise<any[]> {
    /**
    * @Output {*} result = [
     {
       groupTheater: 'CGV',
       cinemas: [
         {
           cinema: 1,
           showtimes: [
             {
               startTime: '2020-01-01T00:00:00.000Z',
               endTime: '2020-01-01T00:00:00.000Z',
             },
           ],
         },
         {
           cinema: 2,
           showtimes: [
             {
               startTime: '2020-01-01T00:00:00.000Z',
               endTime: '2020-01-01T00:00:00.000Z',
             },
           ],
         }
       ]
     },
     {
       groupTheater: 'Lotte',
       cinemas: [
         {
           cinema: 1,
           showtimes: [
             {
               startTime: '2020-01-01T00:00:00.000Z',
               endTime: '2020-01-01T00:00:00.000Z',
             },
           ],
         },
         {
           cinema: 2,
           showtimes: [
             {
               startTime: '2020-01-01T00:00:00.000Z',
               endTime: '2020-01-01T00:00:00.000Z',
             },
           ],
         }
       ]
     },
   ]
    */

    //get All GroupTheater --> join theater --> join showtime --> where showtime.movieId = movieId
    const result = await this.connection
      .getRepository(GroupTheater)
      .createQueryBuilder('groupTheater')
      .leftJoinAndSelect('groupTheater.theaters', 'theaters')
      .leftJoinAndSelect('theaters.showtimes', 'showtimes')
      .where('showtimes.movieId = :movieId', { movieId })
      .getMany();

    // not yet check date

    return result;
  }

  async getShowtimesByTheaterId(theaterId: string): Promise<Movie[]> {
    const theater = await this.theaterService.getTheaterById(theaterId);
    // if (!theater) {
    //   throw new HttpException(
    //     `Theater with id ${theaterId} not found`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    const currentDay = new Date();

    const start = dayjs(currentDay).startOf('day').toDate();
    const end = dayjs(currentDay).endOf('day').toDate();
    // console.log('🚀 ~ file: showtimes.service.ts ~ line 52 ~ start', start);
    // console.log('🚀 ~ file: showtimes.service.ts ~ line 54 ~ end', end);

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

    // const movie = await this.movieService.getMovieById(movieId);
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

    //create Show time

    const result = await this.showtimeRepository
      .createQueryBuilder()
      .insert()
      .into(Showtime)
      .values({ movieId, theaterId, startTime, endTime, room })
      .execute();

    // create tickets
    const seats = await this.theaterService.getSeatsByTheaterIdAndRoom(
      theaterId,
      room,
    );

    await this.ticketService.createTickets(seats, result.identifiers[0].id);
    // console.log(
    //   '🚀 ~ file: showtimes.service.ts ~ line 84 ~ result.raw.insertId',
    //   result.identifiers[0].id,
    // );

    const showtime = await this.showtimeRepository.findOne(
      result.identifiers[0].id,
    );

    return showtime;
  }

  create(createShowtimeDto: CreateShowtimeDto) {
    return 'This action adds a new showtime';
  }

  findAll() {
    return `This action returns all showtimes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} showtime`;
  }

  update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    return `This action updates a #${id} showtime`;
  }

  remove(id: number) {
    return `This action removes a #${id} showtime`;
  }
}
