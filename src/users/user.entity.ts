import { BaseEntity } from 'src/base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  userName: string;

  @Column({ default: true })
  isActive: boolean;
}
