import { v4 as uuidv4 } from "uuid";
import { UsersRepository } from "../../src/controllers/repositories/UsersRepository";
import { generateAuthToken } from "../../src/middleware/authentication";
import { User } from "../../src/models/User";

const saveUser = async (user: User) => {
  await UsersRepository.instance.save(user);
};

let userOne: User;
let userTwo: User;

const createUsers = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT_SECRET defined on .env");
  }

  const userOneId = uuidv4();
  userOne = UsersRepository.instance.create({
    id: userOneId,
    name: "userOne",
    email: "userOne@test.com",
    password: "userOne-password",
  });
  generateAuthToken(userOne);

  const userTwoId = uuidv4();
  userTwo = UsersRepository.instance.create({
    id: userTwoId,
    name: "userTwo",
    email: "userTwo@test.com",
    password: "userTwo-password",
  });
  generateAuthToken(userTwo);
};

export { createUsers, saveUser, userOne, userTwo };
