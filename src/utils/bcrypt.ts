import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPasswordAsync = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

const comparePasswordAsync = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export { hashPasswordAsync, comparePasswordAsync };
