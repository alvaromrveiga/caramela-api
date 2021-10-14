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
      const response = await showPrivateUserUseCase.execute(user);

      expect(response).toHaveProperty("updated_at");
      expect(response).toHaveProperty("created_at");
      expect(response).toHaveProperty("tokens");
      expect(response).toHaveProperty("avatar");
      expect(response.name).toEqual("Tester");
      expect(response.email).toEqual("tester@mail.com");

      expect(response).not.toHaveProperty("password");
      expect(response).not.toHaveProperty("id");
    }
  });
});
