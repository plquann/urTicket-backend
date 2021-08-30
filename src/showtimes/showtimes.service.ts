import { Theater } from './../theaters/entities/theater.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieService } from 'src/movies/movie.service';
import { TheatersService } from 'src/theaters/theaters.service';
import { Repository } from 'typeorm';
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

    //check time
    // const showtimes = await this.showtimeRepository
    //   .createQueryBuilder()
    //   .where('theaterId = :theaterId', { theaterId: theater.id })
    //   .andWhere('startTime >= :startTime', {
    //     startTime: createShowtimeDto.startTime,
    //   })
    //   .getMany();

    // const showtime = this.showtimeRepository.create(createShowtimeDto);
    // return await this.showtimeRepository.save(showtime);
    const start = new Date(startTime);
    // const end = start.getTime() + 100 * 60000;
    // console.log(new Date(end));
    // return 'This action adds a new showtime';

    const endTime = new Date(start.getTime() + movie.duration * 60000);

    //create Ticket
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
