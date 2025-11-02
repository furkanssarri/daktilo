import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import type { VerifiedCallback } from "passport-jwt";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: Express.User | false, info: unknown) => {
      if (err)
        return res.status(500).json({ message: "Internal server error" });

      if (!user)
        return res
          .status(401)
          .json({
            message: "Unauthorized. Invalid or missing token.",
            details: info,
          });

      // Attach authenticated user to the request
      req.user = user;
      next();
    },
  )(req, res, next);
};
