import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { UpdatePetUseCase } from "./UpdatePetUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let updatePetUseCase: UpdatePetUseCase;

let userId: string;
let otherUserPetId: string;
let petOneId: string;
// let petTwoId: string;

describe("Update Pet use case", () => {
  beforeEach(async () => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    updatePetUseCase = new UpdatePetUseCase(
      inMemoryPetsRepository,
      inMemoryUsersRepository
    );

    await inMemoryUsersRepository.createAndSave({
      email: "firstTester@mail.com",
      name: "FirstTester",
      password: "testerPassword",
    });

    let user = await inMemoryUsersRepository.findByEmail(
      "firstTester@mail.com"
    );

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;
    }

    let pet = await inMemoryPetsRepository.createAndSave({
      name: "FirstPetster",
      species: "Bird",
      birthday: new Date("2021-02-20"),
      gender: "Male",
      weight_kg: 0.1,
      user_id: userId,
    });
    otherUserPetId = pet.id;

    await inMemoryUsersRepository.createAndSave({
      email: "tester@mail.com",
      name: "Tester",
      password: "testerPassword",
    });

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;
    }

    pet = await inMemoryPetsRepository.createAndSave({
      name: "Petster",
      species: "Hamster",
      birthday: new Date("2021-02-20"),
      gender: "Female",
      weight_kg: 0.1,
      user_id: userId,
    });
    petOneId = pet.id;

    pet = await inMemoryPetsRepository.createAndSave({
      name: "Petster2",
      species: "Dog",
      user_id: userId,
    });
    // petTwoId = pet.id;
  });

  it("Should not update pet if it does not exist", async () => {
    await expect(
      updatePetUseCase.execute(userId, "31962681-eec5-4e11-9618-6306fc3995d3", {
        name: "TicTic",
      })
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not update other user's pet", async () => {
    await expect(
      updatePetUseCase.execute(userId, otherUserPetId, {
        name: "TicTic",
      })
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should update pet", async () => {
    const pet = await updatePetUseCase.execute(userId, petOneId, {
      name: "TicTic",
      weight_kg: 0.15,
      species: "Syrian Hamster",
      birthday: new Date("2020-01-22"),
      gender: "Male",
    });

    expect(pet.id).toEqual(petOneId);
    expect(pet.gender).toEqual("Male");
    expect(pet.name).toEqual("TicTic");
    expect(pet.species).toEqual("Syrian Hamster");
    expect(pet.weight_kg).toEqual(0.15);
    expect(pet.birthday).toEqual(new Date("2020-01-22"));
  });
});
