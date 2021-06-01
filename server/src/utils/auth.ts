import jwt from "jsonwebtoken";
import { User } from "../models/User";

const auth = async (req: Request, res: Response) => {};

const generateAuthToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("No JWT_SECRET defined on .env");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  if (!user.tokens) {
    user.tokens = [];
  }
  user.tokens.push(token);
};

export { generateAuthToken };
