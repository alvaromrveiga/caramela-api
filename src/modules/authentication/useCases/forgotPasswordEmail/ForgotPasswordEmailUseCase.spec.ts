import { mock } from "jest-mock-extended";

import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ForgotPasswordEmailUseCase } from "./ForgotPasswordEmailUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let mailProviderMock: IMailProvider;
let forgotPasswordEmailUseCase: ForgotPasswordEmailUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Login User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    mailProviderMock = mock<IMailProvider>();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    forgotPasswordEmailUseCase = new ForgotPasswordEmailUseCase(
      inMemoryUsersRepository,
      mailProviderMock
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

    expect(mailProviderMock.sendMail).toHaveBeenCalled();
  });

  it("Should not send forgot password email if user not found", async () => {
    await forgotPasswordEmailUseCase.execute(
      "invalidUserEmail",
      "localhost:3333"
    );

    expect(mailProviderMock.sendMail).not.toHaveBeenCalled();
  });
});
