import "dotenv/config";
import jwt from "jsonwebtoken";

const generateToken = (userId: string, userEmail: string) => {
  const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!accessSecret || !refreshSecret)
    throw new Error("JWT secrets are not defined.");

  const accessToken = jwt.sign({ id: userId, email: userEmail }, accessSecret, {
    expiresIn: "4h", // shorter-lived access token
  });

  const refreshToken = jwt.sign(
    { id: userId, email: userEmail },
    refreshSecret,
    {
      expiresIn: "7d", // longer-lived refresh token
    },
  );

  return { accessToken, refreshToken };
};

export default generateToken;
