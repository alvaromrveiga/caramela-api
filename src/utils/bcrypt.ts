import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPasswordAsync = async (password: string) => {
  return bcrypt.hash(password, saltRounds).then(function (hash) {
    return hash;
  });
};

const comparePasswordAsync = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash).then(function (result) {
    return result;
  });
};

export { hashPasswordAsync, comparePasswordAsync };
