import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('People')
export class Person extends BaseEntity {
  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  position: string;

  @Column({ default: true })
  isActive: boolean;
}
