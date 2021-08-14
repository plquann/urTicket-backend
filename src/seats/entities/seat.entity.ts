import { Ticket } from 'src/tickets/entities/ticket.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Theater } from 'src/theaters/entities/theater.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Theater, (theater: Theater) => theater.seats)
  theater: Theater;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.seat)
  tickets: Ticket[];
}
