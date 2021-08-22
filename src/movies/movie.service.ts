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

  async createMovie(createMovie: CreateMovieDto): Promise<Movie> {
    try {
      const { genresArr, castsArr, crewsArr, ...movieData } = createMovie;
      const movie = await this.movieRepository.create(movieData);

      await this.movieRepository.save(movie);

      await this.createRelationMovie(movie.id, genresArr, 'genres');
      await this.createRelationMovie(movie.id, castsArr, 'casts');
      await this.createRelationMovie(movie.id, crewsArr, 'crews');

      return movie;
    } catch (error) {
      throw new HttpException('Can not create Movie !', HttpStatus.CONFLICT);
    }
  }

  async createRelationMovie(
    movieId: string,
    relationData: string[],
    relationName: string,
  ): Promise<void> {
    try {
      await this.movieRepository
        .createQueryBuilder()
        .relation(Movie, relationName)
        .of(movieId)
        .add(relationData);
    } catch (error) {
      throw new HttpException(
        `Could not create ${relationName} for movie`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    const movies = await this.movieRepository.find();

    if (!movies.length)
      throw new HttpException('Movies not found!', HttpStatus.NOT_FOUND);

    return movies;
  }

  async getMovieById(movieId: string): Promise<Movie> {
    
    const movie = await this.movieRepository
      .createQueryBuilder('movie')
      .where('movie.id = :id', { id: movieId })
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.casts', 'casts')
      .leftJoinAndSelect('movie.crews', 'crews')
      .getOne();

    if (!movie)
      throw new HttpException('Movie not found!', HttpStatus.NOT_FOUND);

    return movie;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
