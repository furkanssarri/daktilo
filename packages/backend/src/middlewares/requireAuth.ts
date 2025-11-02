import passport from "passport";
import type { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. Invalid or missing token.",
        details: info,
      });
    }

    // ✅ Attach authenticated user to the request
    req.user = user;
    next();
  })(req, res, next);
};
