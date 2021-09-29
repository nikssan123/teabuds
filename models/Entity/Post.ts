import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("user")
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column() title: string;

    @Column() description: string;

    @Column() image: string;

    @Column() likes: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    // relationship with User -> ManyToOne
    // likes: realationship with User - Post -> ManyToMany

    // @BeforeInsert()
    // private async hashPassword() {
    //     this.created = new Date();
    // }
}
