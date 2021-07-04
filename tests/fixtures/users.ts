import { UsersRepository } from "../../src/controllers/repositories/UsersRepository";

interface IUserBody {
  name: string;
  email: string;
  password: string;
}

const getUsers = async () => {
  const { rawUserOne, rawUserTwo } = getRawUsers();

  await UsersRepository.instance.createAndSave(rawUserOne);
  await UsersRepository.instance.createAndSave(rawUserTwo);

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

export { getUsers, getRawUsers, IUserBody };
