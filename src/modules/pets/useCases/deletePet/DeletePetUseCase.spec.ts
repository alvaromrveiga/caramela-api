import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { DeletePetUseCase } from "./DeletePetUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let deletePetUseCase: DeletePetUseCase;

let userId: string;
let otherUserPetId: string;
let petOneId: string;
let petTwoId: string;

describe("Delete Pet use case", () => {
  beforeEach(async () => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    deletePetUseCase = new DeletePetUseCase(
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

  it("Should delete pet", async () => {
    await deletePetUseCase.execute(userId, petTwoId);

    const pet = await inMemoryPetsRepository.findByUserAndPetId(
      userId,
      petTwoId
    );

    expect(pet).toBeUndefined();

    const allPets = await inMemoryPetsRepository.findAllByUserID(userId);

    expect(allPets).toBeDefined();
    if (allPets) {
      expect(allPets.length).toEqual(1);
      expect(allPets[0].name).toEqual("Petster");
    }
  });

  it("Should not delete pet from another user", async () => {
    await expect(
      deletePetUseCase.execute(userId, otherUserPetId)
    ).rejects.toEqual(new ErrorWithStatus(404, "Pet not found!"));
  });

  it("Should not delete pet if user is invalid", async () => {
    await expect(
      deletePetUseCase.execute("ceb791b0-5bab-48e1-8a55-43c15a33e12d", petTwoId)
    ).rejects.toEqual(new AuthenticationError());
  });
});
