import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, MoreThan, ILike } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieStatus } from 'src/constants';
import { getSkipLimit } from 'src/common/utils';
@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

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
    page?: number,
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
        voteCount: 'DESC',
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

  async getMovieByGenre(
    page: number,
    limit: number,
    genre: string,
  ): Promise<any> {
    const pagination = getSkipLimit({ page, limit });

    const [movies, count] = await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genres')
      .where('genres.name = :genreName', { genreName: genre })
      .take(pagination.limit)
      .skip(pagination.skip)
      .getManyAndCount();

    if (!movies.length)
      throw new HttpException(
        `Movies ${genre} not found!`,
        HttpStatus.NOT_FOUND,
      );

    return {
      movies,
      totalRow: count,
    };
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

  async searchForMovies(searchTerm: string): Promise<any> {
    const [movies, count] = await this.movieRepository.findAndCount({
      select: [
        'id',
        'title',
        'releaseDate',
        'voteAverage',
        'posterUrl',
        'classify',
        'duration',
        'voteAverage',
      ],
      where: { title: ILike(`%${searchTerm}%`) },
      order: {
        id: 'ASC',
        voteCount: 'DESC',
      },
      take: 10,
      skip: 0,
    });

    return {
      movies,
      totalRow: count,
    };
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
}
