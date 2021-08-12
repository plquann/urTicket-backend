import { BaseEntity } from "src/base/base.entity";
import { Theater } from "src/theaters/entities/theater.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('GroupTheater')
export class GroupTheater extends BaseEntity{
    @Column('varchar', { length: 30 })
    name: string;

    @Column()
    logo: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(()=> Theater, (theater: Theater)=> theater.groupTheater)
    theaters: Theater[];
}
