import { randomUUID } from "node:crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id_user: string

    @Column({ type: 'varchar', nullable: false })
    name: string

    @Column({ type: 'varchar', nullable: false })
    email: string

    @Column({ type: 'varchar', nullable: false })
    password: string

    constructor(
        name: string,
        email: string,
        password: string
    ){
        this.id_user = randomUUID()
        this.name = name
        this.email = email
        this.password = password
    }
}