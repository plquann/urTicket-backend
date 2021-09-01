import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieService } from 'src/movies/movie.service';
import { TheatersService } from 'src/theaters/theaters.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { Raw, Repository } from 'typeorm';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    private readonly movieService: MovieService,
    private readonly theaterService: TheatersService,
    private readonly ticketService: TicketsService,
  ) {}

  async getShowtimesByMovieId(movieId: string): Promise<Showtime[]> {
    const showtimes = await this.showtimeRepository.find({
      where: { movieId },
    });
    return showtimes;
  }

  async getShowtimesByTheaterId(theaterId: string): Promise<Showtime[]> {
    const showtimes = await this.showtimeRepository.find({
      where: { theaterId },
    });
    return showtimes;
  }

  async createShowtime(createShowtimeDto: CreateShowtimeDto): Promise<any> {
    const { movieId, theaterId, startTime, room } = createShowtimeDto;

    const movie = await this.movieService.getMovieById(movieId);
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

    const showtimes = await this.showtimeRepository.find({
      where: [
        {
          theaterId,
          room,
          startTime: Raw((alias) => `${alias} <= :date`, { date: start }),
          endTime: Raw((alias) => `${alias} >= :date`, { date: start }),
        },
        {
          theaterId,
          room,
          startTime: Raw((alias) => `${alias} <= :date`, { date: endTime }),
          endTime: Raw((alias) => `${alias} >= :date`, { date: endTime }),
        },
      ],
    });

    if (showtimes.length > 0) {
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
