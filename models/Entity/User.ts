import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Post } from "./Post";
import bcrypt from "bcrypt";
import { Comments } from "./Comments";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    // relationship with Post -> OneToMany
    // One user can have many posts; One post should have only one owner
    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    // relationship with Comments -> OneToMany
    // One user can have many comments; One comment should have only one author
    @OneToMany(() => Comments, comments => comments.user)
    comments: Comments[];

    // followings
    @ManyToMany(() => User, user => user.following)
    @JoinTable()
    following: User[];

    // followers
    @ManyToMany(() => User, user => user.followers)
    @JoinTable()
    followers: User[];

    private tempPassword: string;

    // followersCount: number;

    // add tempPassword -> check if password is changed
    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    // count the followers the user has -> no need to load the reliation
    // @AfterLoad()
    // async countFollowers() {
    //     const count = User.createQueryBuilder("user")
    //         .leftJoin("user.followers", "followers")
    //         .loadRelationCountAndMap("user.followersCount", "user.followers");

    //     this.followersCount = await count.getRawOne(
    // }

    // if the password is changed or new -> hash the password
    @BeforeUpdate()
    @BeforeInsert()
    private async hashPassword() {
        if (this.tempPassword !== this.password) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    }

    // add a method to the User.repository to compare passwords
    public async comparePassword(password: string) {
        const isMatch = await bcrypt.compare(password, this.password);

        return isMatch;
    }
}
