import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowPrivateUserUseCase } from "./ShowPrivateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showPrivateUserUseCase: ShowPrivateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show Private User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showPrivateUserUseCase = new ShowPrivateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should show private user information", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();

    if (user) {
      const response = await showPrivateUserUseCase.execute(user.id);

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("updated_at");
      expect(response).toHaveProperty("created_at");
      expect(response).toHaveProperty("tokens");
      expect(response).toHaveProperty("avatar");
      expect(response.name).toEqual("Tester");
      expect(response.email).toEqual("tester@mail.com");

      expect(response).not.toHaveProperty("password");
    }
  });

  it("Should not show private information if user is invalid", async () => {
    await expect(
      showPrivateUserUseCase.execute("dd17a4f1-e819-4972-ae6b-abb660fc5e66")
    ).rejects.toEqual(new AuthenticationError());
  });
});
