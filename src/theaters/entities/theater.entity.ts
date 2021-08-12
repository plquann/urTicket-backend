import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Theaters')
export class Theater extends BaseEntity {
  @Column('varchar', { length: 512 })
  name: string;

  @Column('varchar', { length: 512 })
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column('simple-array')
  rooms: number[];

  @Column()
  thumbnail: string;

  @Column({ default: true })
  isActive: boolean;
}
