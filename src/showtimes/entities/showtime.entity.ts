import { BaseEntity } from 'src/base/base.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Theater } from 'src/theaters/entities/theater.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('ShowTimes')
export class Showtime extends BaseEntity {
  @Column()
  room: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => Movie, (movie: Movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne (()=> Theater, (theater: Theater) => theater.showtimes)
  theater: Theater;

  @OneToMany(()=>Seat, (seat: Seat) => seat.showtime)
  seats: Seat[];
}
