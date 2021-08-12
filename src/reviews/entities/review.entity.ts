import { BaseEntity } from "src/base/base.entity";
import { Movie } from "src/movies/entities/movie.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('Reviews')
export class Review extends BaseEntity{
    @Column('text')
    content: string;

    @Column()
    rating: number;

    @ManyToOne(() => Movie, (movie: Movie)=> movie.reviews)
    movie: Movie;
}
