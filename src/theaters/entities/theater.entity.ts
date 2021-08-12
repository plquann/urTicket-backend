import { BaseEntity } from 'src/base/base.entity';
import { GroupTheater } from 'src/group-theater/entities/group-theater.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @ManyToOne(()=> GroupTheater, (groupTheater: GroupTheater ) => groupTheater.theaters)
  groupTheater: GroupTheater;

  @OneToMany(()=> Seat, (seat: Seat) => seat.theater)
  seats: Seat[];
}
