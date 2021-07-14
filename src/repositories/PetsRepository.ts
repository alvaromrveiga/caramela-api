import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Pet } from "../models/Pet";

@EntityRepository(Pet)
export class PetsRepository extends Repository<Pet> {
  static get instance() {
    return getCustomRepository(this);
  }
}
