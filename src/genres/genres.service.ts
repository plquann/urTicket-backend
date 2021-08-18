import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
  ) {}

  async create(genre: any): Promise<any> {
    const { name: genreName } = genre;
    const isGenreExist = await this.genresRepository.findOne({
      name: genreName,
    });
    if (isGenreExist)
      throw new HttpException('Genre already exist', HttpStatus.CONFLICT);

    const newGenre = await this.genresRepository.create(genre);
    await this.genresRepository.save(newGenre);

    return newGenre;
  }

  async findAll(): Promise<Genre[]> {
    const allGenres = await this.genresRepository.find();

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
