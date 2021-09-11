import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('News')
export class News extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text')
  content: string;

  @Column()
  image: string;

  @Column()
  isPublished: boolean;

  @Column()
  publishedDate: Date;

  @Column('simple-array')
  category: string[];

  @Column()
  views: number;

  @Column('simple-json')
  author: { name: string; introduction: string };
}
