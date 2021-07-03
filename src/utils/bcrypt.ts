import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPasswordAsync = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePasswordAsync = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export { hashPasswordAsync, comparePasswordAsync };
