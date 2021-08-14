import { BaseEntity } from 'src/base/base.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { Theater } from 'src/theaters/entities/theater.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('Seats')
export class Seat extends BaseEntity {
  @Column()
  row: string;

  @Column()
  column: number;

  @Column()
  type: string;

  @Column()
  room: number;

  @Column()
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Theater, (theater: Theater) => theater.seats)
  theater: Theater;

  @ManyToOne(()=> Showtime, (showtime: Showtime) => showtime.seats)
  showtime: Showtime;

  @ManyToOne(
    () => Reservation,
    (reservation: Reservation) => reservation.seats,
    { nullable: true },
  )
  reservation: Reservation;
}
