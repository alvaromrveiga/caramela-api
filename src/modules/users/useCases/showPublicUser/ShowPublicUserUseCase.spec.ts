import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowPublicUserUseCase } from "./ShowPublicUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showPublicUserUseCase: ShowPublicUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show Public User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showPublicUserUseCase = new ShowPublicUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should show public user information", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();

    if (user) {
      const response = await showPublicUserUseCase.execute(user.id);

      expect(response).toHaveProperty("created_at");
      expect(response.name).toEqual("Tester");

      expect(response).not.toHaveProperty("password");
      expect(response).not.toHaveProperty("email");
      expect(response).not.toHaveProperty("updated_at");
      expect(response).not.toHaveProperty("id");
      expect(response).not.toHaveProperty("tokens");
    }
  });

  it("Should not show public user information for invalid user", async () => {
    await expect(showPublicUserUseCase.execute("invalidID")).rejects.toEqual(
      new ErrorWithStatus(404, "User not found")
    );
  });
});
