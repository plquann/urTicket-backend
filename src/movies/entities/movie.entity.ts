import { BaseEntity } from 'src/base/base.entity';
import { MovieClassification, MovieStatus } from 'src/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('Movies')
export class Movie extends BaseEntity{
  
  @Column('varchar', { length: 512 })
  title: string;

  @Column('varchar', { length: 512 })
  trailerVideoUrl: string;

  @Column('varchar', { length: 512 })
  posterUrl: string;

  @Column('text')
  description: string;

  @Column()
  releaseDate: Date;

  @Column()
  duration: number;

  @Column('varchar', { length: 30 })
  language: string;

  @Column({
    type: 'enum',
    enum: MovieClassification,
    default: MovieClassification.P,
  })
  classify: MovieClassification;

  @Column({ type: 'enum', enum: MovieStatus, default: MovieStatus.OVER })
  status: MovieStatus;

  @Column({ default: true })
  isActive: boolean;

}
