import "dotenv/config";
import jwt from "jsonwebtoken";

const generateToken = (
  userId: string,
  userEmail: string,
  role: "ADMIN" | "USER",
  username?: string | null,
) => {
  const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!accessSecret || !refreshSecret)
    throw new Error("JWT secrets are not defined.");

  const accessToken = jwt.sign(
    { id: userId, email: userEmail, role, username },
    accessSecret,
    {
      expiresIn: "4h",
    },
  );

  const refreshToken = jwt.sign(
    { id: userId, email: userEmail },
    refreshSecret,
    {
      expiresIn: "7d",
    },
  );

  return { accessToken, refreshToken };
};

export default generateToken;
