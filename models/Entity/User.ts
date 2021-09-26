import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
} from "typeorm";
import bcrypt from "bcrypt";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    private tempPassword: string;

    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeUpdate()
    @BeforeInsert()
    private async hashPassword() {
        if (this.tempPassword !== this.password) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    }

    public async comparePassword(password: string) {
        const isMatch = await bcrypt.compare(password, this.password);

        return isMatch;
    }
}
