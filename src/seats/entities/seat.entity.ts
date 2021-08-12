import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

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
}
