import { BaseEntity } from 'src/base/base.entity';
import { UserGender, UserRole } from 'src/constants';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  address?: string;

  @Column()
  birthDate?: string;

  @Column()
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.MALE,
  })
  gender: UserGender;

  @Column({
    default:
      'https://res.cloudinary.com/quankhs/image/upload/v1620351649/avatar_default.jpg',
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;
}
