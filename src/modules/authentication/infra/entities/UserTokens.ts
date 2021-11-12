import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { User } from "../../../users/infra/typeorm/entities/User";

@Entity("users_tokens")
export class UserTokens {
  @PrimaryColumn()
  readonly id!: string;

  @Column()
  refresh_token!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user_id!: string;

  @Column()
  machine_info?: string;

  @Column()
  expiration_date!: Date;

  @CreateDateColumn()
  created_at!: Date;

  constructor(data: {
    id?: string;
    refresh_token: string;
    user_id: string;
    machine_info?: string;
    expiration_date: Date;
  }) {
    if (!data) {
      this.id = uuidv4();
    } else {
      this.id = data.id || uuidv4();
      this.refresh_token = data.refresh_token;
      this.user_id = data.user_id;
      this.machine_info = data.machine_info;
      this.expiration_date = data.expiration_date;
    }
  }
}
