import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { ShowAllPetsUseCase } from "./ShowAllPetsUseCase";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showAllPetsUseCase: ShowAllPetsUseCase;

let userId: string;

describe("Show All Pets use case", () => {
  beforeEach(async () => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showAllPetsUseCase = new ShowAllPetsUseCase(
      inMemoryPetsRepository,
      inMemoryUsersRepository
    );

    await inMemoryUsersRepository.createAndSave({
      email: "tester@mail.com",
      name: "Tester",
      password: "testerPassword",
    });

    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;
    }

    await inMemoryPetsRepository.createAndSave({
      name: "Petster",
      species: "Hamster",
      user_id: userId,
    });

    await inMemoryPetsRepository.createAndSave({
      name: "Petster2",
      species: "Dog",
      user_id: userId,
    });
  });

  it("Should show all user pets", async () => {
    const pets = await showAllPetsUseCase.execute(userId);

    expect(pets).toBeDefined();
    if (pets) {
      expect(pets.length).toEqual(2);
      expect(pets[0].name).toEqual("Petster");
      expect(pets[0].species).toEqual("Hamster");

      expect(pets[1].name).toEqual("Petster2");
      expect(pets[1].species).toEqual("Dog");
    }
  });

  it("Should not show pets if user is invalid", async () => {
    await expect(
      showAllPetsUseCase.execute("da45fc09-8f17-456d-b83e-187ecc8e97a0")
    ).rejects.toEqual(new AuthenticationError());
  });
});
