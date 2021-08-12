import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Genres')
export class Genre extends BaseEntity {
  @Column('varchar', { length: 30 })
  name: string;
}
