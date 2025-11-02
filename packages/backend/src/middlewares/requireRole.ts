import type { Request, Response, NextFunction } from "express";

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by requireAuth
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message:
          "Forbidden: You do not have permission to access this resource.",
      });
    }
    next();
  };
};
