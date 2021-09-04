import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/base/base.entity';
import { Product } from './product.entity';

@Entity('ProductOrders')
export class ProductOrder extends BaseEntity {
  @Column()
  quantity: number;

  @Column()
  reservationId: string;

  @Column()
  productId: string;

  @ManyToOne(
    () => Reservation,
    (reservation: Reservation) => reservation.productOrders,
  )
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @ManyToOne(() => Product, (product: Product) => product.orders)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
