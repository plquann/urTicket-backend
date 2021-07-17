import { BaseEntity } from 'src/base/base.entity';
import { UserGender, UserRole } from 'src/constants';
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('Users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.MALE,
  })
  gender?: UserGender;

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
