import { EtherealMailProvider } from "../../../../shared/container/providers/MailProvider/implementations/EtherealMailProvider";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { InMemoryUsersTokensRepository } from "../../repositories/in-memory/InMemoryUsersTokensRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UserNotFoundError } from "../showPublicUser/errors/UserNotFoundError";
import { ForgotPasswordEmailUseCase } from "./ForgotPasswordEmailUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository;
let etherealMailProvider: EtherealMailProvider;
let forgotPasswordEmailUseCase: ForgotPasswordEmailUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Login User use case", () => {
  // Set timeout to await the fake email to be "sent" and console logged
  jest.setTimeout(15000);

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository();
    etherealMailProvider = new EtherealMailProvider();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    forgotPasswordEmailUseCase = new ForgotPasswordEmailUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository,
      etherealMailProvider
    );

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should send forgot password email", async () => {
    await forgotPasswordEmailUseCase.execute(
      "tester@mail.com",
      "localhost:3333"
    );
  });

  it("Should not send forgot password email if user not found", async () => {
    await expect(
      forgotPasswordEmailUseCase.execute("invalidUserEmail", "localhost:3333")
    ).rejects.toEqual(new UserNotFoundError());
  });
});
