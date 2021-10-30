import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("users")
export class User {
  @PrimaryColumn()
  readonly id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  avatar?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(data: {
    id?: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
  }) {
    if (!data) {
      this.id = uuidv4();
    } else {
      this.id = data.id || uuidv4();
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.avatar = data.avatar;
    }
  }
}
