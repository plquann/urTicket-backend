import { Reservation } from 'src/reservations/entities/reservation.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { ProductOrder } from './productOrder.entity';
@Entity('Products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => ProductOrder,
    (productOrder: ProductOrder) => productOrder.product,
    { nullable: true },
  )
  orders: ProductOrder[];
}
