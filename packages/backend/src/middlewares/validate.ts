import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Form fields are not valid.",
      errors: errors.array().map((err) => {
        const field = "param" in err ? err.param : undefined;
        return {
          field,
          message: err.msg,
        };
      }),
    });
  }

  next();
};
