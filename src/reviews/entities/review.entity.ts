import { BaseEntity } from "src/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity('Reviews')
export class Review extends BaseEntity{
    @Column('text')
    content: string;

    @Column()
    rating: number;
}
