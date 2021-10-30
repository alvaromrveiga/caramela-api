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
  readonly id!: string;

  @Column()
  user_id!: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user!: User;

  @Column()
  name!: string;

  @Column()
  gender?: string;

  @Column()
  species!: string;

  @Column()
  weight_kg?: number;

  @Column()
  birthday?: Date;

  @Column()
  avatar?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(data?: {
    id?: string;
    user_id: string;
    name: string;
    gender?: string;
    species: string;
    weight_kg?: number;
    birthday?: Date;
    avatar?: string;
  }) {
    if (!data) {
      this.id = uuidv4();
    } else {
      this.id = data.id || uuidv4();
      this.user_id = data.user_id;
      this.name = data.name;
      this.gender = data.gender;
      this.species = data.species;
      this.weight_kg = data.weight_kg;
      this.birthday = data.birthday;
      this.avatar = data.avatar;
    }
  }
}
