import { Seat } from './../../seats/entities/seat.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('Reservations')
export class Reservation extends BaseEntity {
  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  originalPrice: number;

  @Column()
  totalPrice: number;

  @OneToMany(()=> Seat, (seat: Seat) => seat.reservation)
  seats: Seat[];
}
