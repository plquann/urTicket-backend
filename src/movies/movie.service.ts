import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, FindManyOptions, MoreThan } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { moviesSeed } from './../database/seeds/movies.seed';
import { MovieStatus } from 'src/constants';
import { getSkipLimit } from 'src/common/utils';
@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private connection: Connection,
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

  async loadRelationsMovie(
    movieId: string,
    relationName: string,
  ): Promise<string[]> {
    const movieWithRelations = await this.movieRepository
      .createQueryBuilder('movie')
      .relation(Movie, relationName)
      .of(movieId)
      .loadMany();

    const result = movieWithRelations.map((item) => item.id);

    return result;
  }

  async deleteRelationMovie(
    movieId: string,
    relationData: string[],
    relationName: string,
  ): Promise<void> {
    try {
      await this.movieRepository
        .createQueryBuilder()
        .relation(Movie, relationName)
        .of(movieId)
        .remove(relationData);
    } catch (error) {
      throw new HttpException(
        `Could not delete ${relationName} for movie`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMovies(
    page: number,
    limit?: number,
    startId?: string,
  ): Promise<any> {
    const where: FindManyOptions<Movie>['where'] = {};
    let separateCount = 0;

    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.movieRepository.count();
    }

    const pagination = getSkipLimit({ page, limit });

    const [movies, count] = await this.movieRepository.findAndCount({
      where,
      relations: ['genres'],
      order: {
        id: 'ASC',
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    if (!movies.length)
      throw new HttpException('Movies not found!', HttpStatus.NOT_FOUND);

    return {
      movies,
      totalRow: startId ? separateCount : count,
    };
  }

  async getMovieByStatus(status: MovieStatus): Promise<Movie[]> {
    const movies = await this.movieRepository.find({
      relations: ['genres'],
      where: {
        status: status,
      },
    });

    if (!movies.length)
      throw new HttpException(
        `Movies ${status} not found!`,
        HttpStatus.NOT_FOUND,
      );

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

  async getMovieHighlight(): Promise<Movie[]> {
    const movies = await this.movieRepository.find({
      relations: ['genres'],
      where: {
        status: MovieStatus.PLAYING,
      },
      order: {
        voteCount: 'DESC',
      },
      take: 5,
    });

    return movies;
  }

  async updateMovieById(
    movieId: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    const { genresArr, castsArr, crewsArr, ...movieData } = updateMovieDto;

    await this.movieRepository.update(movieId, movieData);
    const movie = await this.movieRepository.findOne(movieId);

    if (!movie)
      throw new HttpException('Movie not found!', HttpStatus.NOT_FOUND);

    return movie;
  }

  async deleteMovieById(movieId: string): Promise<any> {
    const genres = await this.loadRelationsMovie(movieId, 'genres');
    const casts = await this.loadRelationsMovie(movieId, 'casts');
    const crews = await this.loadRelationsMovie(movieId, 'crews');

    genres.length &&
      (await this.deleteRelationMovie(movieId, genres, 'genres'));
    casts.length && (await this.deleteRelationMovie(movieId, casts, 'casts'));
    crews.length && (await this.deleteRelationMovie(movieId, crews, 'crews'));

    const result = await this.movieRepository
      .createQueryBuilder()
      .delete()
      .from(Movie)
      .where('id = :id', { id: movieId })
      .execute();

    if (!result.affected)
      throw new HttpException('Movie not found!', HttpStatus.NOT_FOUND);
  }
}
