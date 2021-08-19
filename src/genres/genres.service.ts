import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { genresSeed } from 'src/database/seeds/genres.seed';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
  ) {}

  async seedersGenres(): Promise<any> {
    const genres = genresSeed;
    const result = await this.genresRepository
      .createQueryBuilder()
      .insert()
      .into(Genre)
      .values(genres)
      .execute();

    if (!result)
      throw new HttpException(
        'Genres seed failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  async create(genre: any): Promise<any> {
    const { name: genreName } = genre;
    const isGenreExist = await this.genresRepository.findOne({
      name: genreName,
    });
    if (isGenreExist)
      throw new HttpException('Genre already exist', HttpStatus.BAD_REQUEST);

    const newGenre = await this.genresRepository.create(genre);
    await this.genresRepository.save(newGenre);

    return newGenre;
  }

  async getGenreById(genreId: string): Promise<Genre> {
    const genre = await this.genresRepository.findOne(genreId);
    if (!genre)
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);

    return genre;
  }

  async getAllGenres(): Promise<Genre[]> {
    const allGenres = await this.genresRepository.find();
    if (!allGenres)
      throw new HttpException('Genres not found', HttpStatus.NOT_FOUND);

    return allGenres;
  }

  async updateGenreById(genreId: string, genreName: string): Promise<any> {
    const genre = await this.genresRepository.update(genreId, {
      name: genreName,
    });
    if (!genre.affected)
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
  }

  async deleteGenreById(genreId: string): Promise<any> {
    const genre = await this.genresRepository.delete(genreId);
    if (!genre.affected)
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
  }
}
