import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('Tickets')
export class Ticket extends BaseEntity {
  @Column()
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Showtime, (showtime: Showtime) => showtime.id)
  showtime: Showtime;

  @ManyToOne(() => Seat, (seat: Seat) => seat.id)
  seat: Seat;

  @ManyToOne(() => Reservation, (reservation: Reservation) => reservation.id, {
    nullable: true,
  })
  reservation: Reservation;
}
