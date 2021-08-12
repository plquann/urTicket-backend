import { BaseEntity } from "src/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity('ShowTimes')
export class Showtime extends BaseEntity{
    @Column()
    room: number;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

}
