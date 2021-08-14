import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Column, Entity , ManyToOne} from "typeorm";
import { BaseEntity } from 'src/base/base.entity';
import { Product } from './product.entity';

@Entity('ProductOrders')
export class ProductOrder extends BaseEntity {
    @Column()
    quantity: number;

    @ManyToOne(()=> Reservation, (reservation: Reservation) => reservation.productOrders)
    reservation: Reservation;

    @ManyToOne(()=> Product, (product: Product) => product.orders)
    product: Product;
}