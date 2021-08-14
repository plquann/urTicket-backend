import { Reservation } from 'src/reservations/entities/reservation.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theaters/entities/theater.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
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

  @ManyToOne(() => Theater, (theater: Theater) => theater.showtimes)
  theater: Theater;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.showtime)
  ticket: Ticket[];

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.showtime,
    { nullable: true },
  )
  reservations: Reservation[];
}
