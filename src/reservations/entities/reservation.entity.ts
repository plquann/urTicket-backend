import { ProductOrder } from './../../products/entities/productOrder.entity';
import { Product } from './../../products/entities/product.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { BaseEntity } from 'src/base/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('Reservations')
export class Reservation extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  showtimeId: string;

  @Column()
  userId: string;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.reservation)
  ticket: Ticket[];

  @ManyToOne(() => Showtime, (showtime: Showtime) => showtime.reservations)
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @ManyToOne(() => User, (user: User) => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => ProductOrder,
    (productOrder: ProductOrder) => productOrder.reservation,
    { nullable: true },
  )
  productOrders: ProductOrder[];
}
