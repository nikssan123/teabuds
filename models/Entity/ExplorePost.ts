import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
    Double,
} from "typeorm";
import { User } from "./User";

enum Drink {
    Tea = "Tea",
    Coffee = "Coffee",
    Alcohol = "Alcoholic Beverage",
}

@Entity()
export class ExplorePost extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 75, nullable: false })
    title: string;

    @Column({ default: "" })
    description: string;

    @Column({ type: "decimal", precision: 12, scale: 9 })
    latitude: number;

    @Column({ type: "decimal", precision: 12, scale: 9 })
    longitude: number;

    @Column() city: string;

    @Column() drink: Drink;

    @Column() phone: number;

    @Column() email: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    // relationship with User -> ManyToOne
    // One user can have many posts; One post should have only one owner
    // when user is deleted -> delete the user's posts
    @ManyToOne(() => User, user => user.posts, { onDelete: "CASCADE" })
    user: User;
}
