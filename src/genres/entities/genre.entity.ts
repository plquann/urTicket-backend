import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Genres')
export class Genre extends BaseEntity {
  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;
}
