import { UsersRepository } from "../../controllers/UsersRepository";
import createConnection from "../../connection";
import { Connection, getCustomRepository } from "typeorm";
import { User } from "../../models/User";
import { v4 as uuidv4 } from "uuid";

let connection: Connection;
let usersRepository: UsersRepository;

const connect = async () => {
  if (!connection) {
    connection = await createConnection();
    await connection.runMigrations();

    usersRepository = getCustomRepository(UsersRepository);
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

const createUsers = () => {
  userOne = usersRepository.create({
    id: uuidv4(),
    name: "userOne",
    email: "userOne@test.com",
    password: "userOne-password",
  });
};

export { resetDatabase, saveUser, userOne, connect };
