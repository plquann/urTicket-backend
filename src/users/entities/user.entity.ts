import { UserGender, UserRole } from 'src/constants';
import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import PublicFile from 'src/files/publicFile.entity';
import { BaseEntity } from 'src/base/base.entity';

@Entity('Users')
export class User extends BaseEntity{
  
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

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  avatar?: PublicFile;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  roles: UserRole[];

  @Column({ default: true })
  isActive: boolean;

  //refresh token
  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;
}
