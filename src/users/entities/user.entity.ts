import { Reservation } from 'src/reservations/entities/reservation.entity';
import { UserGender, UserRole } from 'src/constants';
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import PublicFile from 'src/files/publicFile.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Review } from 'src/reviews/entities/review.entity';

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

  @OneToMany(() => Review, (review: Review) => review.author, {
    nullable: true,
  })
  reviews?: Review[];

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.user,
    { nullable: true },
  )
  reservations?: Reservation[];

  //PAYMENT INFO
  @Column({ nullable: true })
  public stripeCustomerId: string;
}
