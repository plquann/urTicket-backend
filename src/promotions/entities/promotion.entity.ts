import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Promotion')
export class Promotion extends BaseEntity {
  @Column('varchar', { length: 16 })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 5 })
  discount: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  sumUsersUsed: number;

  @Column({ default: true })
  isActive: boolean;
}
