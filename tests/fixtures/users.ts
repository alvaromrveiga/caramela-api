import { UsersRepository } from "../../src/modules/users/infra/typeorm/repositories/UsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/CreateUserUseCase";

const getRawUsers = () => {
  const rawUserOne = {
    name: "userOne",
    email: "userOne@test.com",
    password: "userOne-pa$sw0rd",
  };

  const rawUserTwo = {
    name: "userTwo",
    email: "userTwo@test.com",
    password: "userTwo-password",
  };

  return { rawUserOne, rawUserTwo };
};

const getUsers = async () => {
  const { rawUserOne, rawUserTwo } = getRawUsers();

  await new CreateUserUseCase(rawUserOne).execute();
  await new CreateUserUseCase(rawUserTwo).execute();

  const userOne = await UsersRepository.instance.findOne({
    email: rawUserOne.email,
  });
  const userTwo = await UsersRepository.instance.findOne({
    email: rawUserTwo.email,
  });

  if (!userOne || !userTwo) {
    throw new Error("Error to save user fixtures");
  }

  return { userOne, userTwo };
};

export { getUsers, getRawUsers };
