import { BaseEntity } from 'src/base/base.entity';
import { MovieClassification, MovieStatus } from 'src/constants';
import { Genre } from 'src/genres/entities/genre.entity';
import { Person } from 'src/people/entities/person.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
@Entity('Movies')
export class Movie extends BaseEntity {
  @Column('varchar', { length: 512 })
  title: string;

  @Column('varchar', { length: 512 })
  trailerVideoUrl: string;

  @Column('varchar', { length: 512 })
  posterUrl: string;

  @Column('varchar', { length: 512 })
  backdropUrl: string;

  @Column('text')
  description: string;

  @Column()
  releaseDate: Date;

  @Column()
  duration: number;

  @Column('varchar', { length: 32 })
  language: string;

  @Column({
    type: 'enum',
    enum: MovieClassification,
    default: MovieClassification.C13,
  })
  classify: MovieClassification;

  @Column({ type: 'enum', enum: MovieStatus, default: MovieStatus.OVER })
  status: MovieStatus;

  @Column({ type: 'float', nullable: true })
  voteAverage: number;

  @Column({ nullable: true })
  voteCount: number;

  @Column({ type: 'float', nullable: true })
  imdbRating: number;

  @Column({ nullable: true })
  tomatoesRating: number;

  @Column({ default: true })
  isActive: boolean;

  //relations - many to many
  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Person)
  @JoinTable()
  casts: Person[];

  @ManyToMany(() => Person)
  @JoinTable()
  crews: Person[];

  //relations - one to many
  @OneToMany(() => Review, (review: Review) => review.movie, { nullable: true })
  reviews: Review[];

  @OneToMany(() => Showtime, (showtime: Showtime) => showtime.movie, {
    nullable: true,
  })
  showtimes: Showtime[];
}
