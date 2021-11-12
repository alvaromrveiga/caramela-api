import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Pet } from "../../../../pets/infra/typeorm/entities/Pet";

@Entity("consultations")
export class Consultation {
  @PrimaryColumn()
  readonly id!: string;

  @Column()
  pet_id!: string;

  @JoinColumn({ name: "pet_id" })
  @ManyToOne(() => Pet)
  pet!: Pet;

  @Column()
  veterinary!: string;

  @Column()
  motive!: string;

  @Column()
  weight_kg?: number;

  @Column()
  vaccines?: string;

  @Column()
  comments?: string;

  @CreateDateColumn()
  created_at!: Date;

  constructor(data?: {
    id?: string;
    pet_id: string;
    veterinary: string;
    motive: string;
    weight_kg?: number;
    vaccines?: string;
    comments?: string;
  }) {
    if (!data) {
      this.id = uuidv4();
    } else {
      this.id = data.id || uuidv4();
      this.pet_id = data.pet_id;
      this.veterinary = data.veterinary;
      this.motive = data.motive;
      this.weight_kg = data.weight_kg;
      this.vaccines = data.vaccines;
      this.comments = data.comments;
    }
  }
}
