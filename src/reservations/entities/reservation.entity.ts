import { ProductOrder } from './../../products/entities/productOrder.entity';
import { Product } from './../../products/entities/product.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

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

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.reservation)
  ticket: Ticket[];

  @ManyToOne(() => Showtime, (showtime: Showtime) => showtime.reservations)
  showtime: Showtime;

  @ManyToOne(() => User, (user: User) => user.reservations)
  user: User;

  @OneToMany(
    () => ProductOrder,
    (productOrder: ProductOrder) => productOrder.reservation,
    { nullable: true },
  )
  productOrders: ProductOrder[];
}
