import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { UpdatePetUseCase } from "./UpdatePetUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let updatePetUseCase: UpdatePetUseCase;

let userId: string;

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

    await inMemoryPetsRepository.createAndSave({
      name: "FirstPetster",
      species: "Bird",
      birthday: new Date("2021-02-20"),
      gender: "Male",
      weight_kg: 0.1,
      user_id: userId,
    });

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

    await inMemoryPetsRepository.createAndSave({
      name: "Petster",
      species: "Hamster",
      birthday: new Date("2021-02-20"),
      gender: "Female",
      weight_kg: 0.1,
      user_id: userId,
    });

    await inMemoryPetsRepository.createAndSave({
      name: "Petster2",
      species: "Dog",
      user_id: userId,
    });
  });

  it("Should not update pet if it does not exist", async () => {
    await expect(
      updatePetUseCase.execute(userId, "inexistentPet", {
        name: "TicTic",
      })
    ).rejects.toEqual(new ErrorWithStatus(404, "Pet not found!"));
  });

  it("Should not update other user's pet", async () => {
    await expect(
      updatePetUseCase.execute(userId, "FirstPetster", {
        name: "TicTic",
      })
    ).rejects.toEqual(new ErrorWithStatus(404, "Pet not found!"));
  });

  it("Should update pet", async () => {
    let pet = await inMemoryPetsRepository.findByUserIDAndName(
      userId,
      "Petster"
    );
    const petId = pet?.id;

    pet = await updatePetUseCase.execute(userId, "Petster", {
      name: "TicTic",
      weight_kg: 0.15,
      species: "Syrian Hamster",
      birthday: new Date("2020-01-22"),
      gender: "Male",
    });

    expect(pet?.id).toEqual(petId);
    expect(pet?.gender).toEqual("Male");
    expect(pet?.name).toEqual("TicTic");
    expect(pet?.species).toEqual("Syrian Hamster");
    expect(pet?.weight_kg).toEqual(0.15);
    expect(pet?.birthday).toEqual(new Date("2020-01-22"));
  });
});
