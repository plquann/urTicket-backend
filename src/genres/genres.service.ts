import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(genreName: any): Promise<any> {
    const newGenre = await this.genreRepository.create(genreName);
    await this.genreRepository.save(newGenre);

    return newGenre;
  }

  async findAll(): Promise<Genre[]> {
    const allGenres = await this.genreRepository.find();

    return allGenres;
  }

  async updateGenreById(genreId: string, newName: string): Promise<Genre> {
    return await this.genreRepository.save({ id: genreId, name: newName });
  }
}
