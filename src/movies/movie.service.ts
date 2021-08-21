import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { moviesSeed } from './../database/seeds/movies.seed';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async seedersMovies() {
    const movies = moviesSeed;

    const result = await this.movieRepository
      .createQueryBuilder()
      .insert()
      .into(Movie)
      .values(movies)
      .execute();

    if (!result)
      throw new HttpException(
        'Could not seed Movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  async getAllMovies(): Promise<Movie[]> {
    const movies = await this.movieRepository.find();

    if (!movies.length)
      throw new HttpException(
        'Movies not found!',
        HttpStatus.NOT_FOUND,
      );

    return movies;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
