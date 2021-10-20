import { User } from "../../infra/typeorm/entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { LoginUserUseCase } from "../loginUser/LoginUserUseCase";
import { LogoutAllUserUseCase } from "./LogoutAllUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let logoutAllUserUseCase: LogoutAllUserUseCase;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User | undefined;

describe("Logout All User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    logoutAllUserUseCase = new LogoutAllUserUseCase(inMemoryUsersRepository);
    loginUserUseCase = new LoginUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    await loginUserUseCase.execute("tester@mail.com", "testerPa$$w0rd");

    await loginUserUseCase.execute("tester@mail.com", "testerPa$$w0rd");

    await loginUserUseCase.execute("tester@mail.com", "testerPa$$w0rd");

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");
  });

  it("Should logout user from all sessions", async () => {
    expect(user).not.toBeUndefined();

    if (user) {
      expect(user.tokens.length).toEqual(3);

      await logoutAllUserUseCase.execute(user.id);
    }

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user?.tokens.length).toEqual(0);
  });
});
