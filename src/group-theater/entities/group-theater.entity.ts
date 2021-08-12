import { BaseEntity } from "src/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity('GroupTheater')
export class GroupTheater extends BaseEntity{
    @Column('varchar', { length: 30 })
    name: string;

    @Column()
    logo: string;

    @Column({ default: true })
    isActive: boolean;
}
