import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Comments } from "./Comments";

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 75, nullable: false })
    title: string;

    @Column({ default: "" })
    description: string;

    @Column({ default: "" })
    image: string;

    @Column({ default: 0 })
    likes: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    // relationship with User -> ManyToOne
    // One user can have many posts; One post should have only one owner
    // when user is deleted -> delete the user's posts
    @ManyToOne(() => User, user => user.posts, { onDelete: "CASCADE" })
    user: User;

    // relationship with Comments -> OneToMayn
    // One post can have many comments; One comment is for one post
    @OneToMany(() => Comments, comments => comments.post)
    comments: Comments[];
}
