import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

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
}
