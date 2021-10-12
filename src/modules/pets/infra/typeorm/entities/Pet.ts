import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { User } from "../../../../users/infra/typeorm/entities/User";

@Entity("pets")
export class Pet {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user: User;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  species: string;

  @Column()
  weight_kg: number;

  @Column()
  birthday: Date;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
