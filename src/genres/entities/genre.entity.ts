import { BaseEntity } from 'src/base/base.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('Genres')
export class Genre extends BaseEntity {
  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @ManyToMany(()=> Movie, (movie: Movie) => movie.genres)
  movies: Movie[];
}
