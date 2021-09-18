import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('News')
export class News extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  image: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: new Date() })
  publishedDate: Date;

  @Column('simple-array')
  tags: string[];

  @Column()
  views: number;

  @Column('simple-json')
  author: { name: string; introduction: string };

  @Column('text', { array: true })
  paragraphs: string[];
}
