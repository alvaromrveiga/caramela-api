import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import createConnection from "../../connection";
import { UsersRepository } from "../../controllers/repositories/UsersRepository";
import { generateAuthToken } from "../../middleware/authentication";
import { User } from "../../models/User";

let connection: Connection;
let usersRepository: UsersRepository;

const connect = async () => {
  if (!connection) {
    connection = await createConnection();
    await connection.runMigrations();

    usersRepository = UsersRepository.instance;
    createUsers();
  }

  return { connection, usersRepository };
};

const resetDatabase = async () => {
  const allUsers = await usersRepository.find();
  await usersRepository.remove(allUsers);
};

const saveUser = async (user: User) => {
  await usersRepository.createAndSave(user);
};

let userOne: User;

const userOneId = uuidv4();
const createUsers = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT_SECRET defined on .env");
  }
  userOne = usersRepository.create({
    id: userOneId,
    name: "userOne",
    email: "userOne@test.com",
    password: "userOne-password",
  });
  generateAuthToken(userOne);
};

export { resetDatabase, saveUser, userOne, connect };
