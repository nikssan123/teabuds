import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comments extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false })
    message: string;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @ManyToOne(() => User, user => user.comments)
    user: User;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;
}
