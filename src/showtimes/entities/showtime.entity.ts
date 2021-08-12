import { BaseEntity } from "src/base/base.entity";
import { Movie } from "src/movies/entities/movie.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('ShowTimes')
export class Showtime extends BaseEntity{
    @Column()
    room: number;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @ManyToOne(()=>Movie, (movie: Movie)=> movie.showtimes)
    movie: Movie;
}
