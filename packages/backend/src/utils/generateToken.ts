import "dotenv/config";
import jwt from "jsonwebtoken";

const generateToken = (userId: string, userEmail: string) => {
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!secret)
    throw new Error(
      "JWT_ACCESS_TOKEN_SECRET environment variable is not defined.",
    );

  const token = jwt.sign({ id: userId, email: userEmail }, secret, {
    expiresIn: "7h",
  });

  return {
    token,
  };
};

export default generateToken;
