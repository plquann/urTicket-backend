import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { BaseEntity } from 'src/base/base.entity';
import { GroupTheater } from 'src/group-theater/entities/group-theater.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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
  rooms: string[];

  @Column()
  thumbnail: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(
    () => GroupTheater,
    (groupTheater: GroupTheater) => groupTheater.theaters,
  )
  @JoinColumn({ name: 'groupTheaterId' })
  groupTheater: GroupTheater;

  @Column()
  groupTheaterId: string;

  @OneToMany(() => Seat, (seat: Seat) => seat.theater)
  seats: Seat[];

  @OneToMany(() => Showtime, (showtime: Showtime) => showtime.theater, {
    nullable: true,
  })
  showtimes: Showtime[];
}
