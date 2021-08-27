import { BaseEntity } from 'src/base/base.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('Reviews')
export class Review extends BaseEntity {
  @Column()
  title: string;

  @Column('text', { nullable: true })
  content: string;

  @Column()
  rating: number;

  @ManyToOne(() => Movie, (movie: Movie) => movie.reviews)
  movie: Movie;

  @ManyToOne(() => User, (user: User) => user.reviews)
  author: User;
}
