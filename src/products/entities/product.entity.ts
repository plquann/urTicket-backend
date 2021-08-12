import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';
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
}
