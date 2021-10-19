import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { ShowPetUseCase } from "./ShowPetUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showPetUseCase: ShowPetUseCase;

let userId: string;
let otherUserPetId: string;
let petOneId: string;
let petTwoId: string;

describe("Show Pet use case", () => {
  beforeEach(async () => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showPetUseCase = new ShowPetUseCase(
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
    petTwoId = pet.id;
  });

  it("Should show pet", async () => {
    const pet = await showPetUseCase.execute(userId, petOneId);
    expect(pet).toBeDefined();

    if (pet) {
      expect(pet.id).toEqual(petOneId);
      expect(pet.name).toEqual("Petster");
      expect(pet.species).toEqual("Hamster");
      expect(pet.user_id).toEqual(userId);
      expect(pet.weight_kg).toEqual(0.1);
      expect(pet.gender).toEqual("Female");
    }
  });

  it("Should not show pet if user is invalid", async () => {
    await expect(
      showPetUseCase.execute("ceb791b0-5bab-48e1-8a55-43c15a33e12d", petOneId)
    ).rejects.toEqual(new ErrorWithStatus(401, "Please authenticate"));
  });

  it("Should not show another user's pet", async () => {
    await expect(
      showPetUseCase.execute(userId, otherUserPetId)
    ).rejects.toEqual(new ErrorWithStatus(404, "Pet not found!"));
  });
});
