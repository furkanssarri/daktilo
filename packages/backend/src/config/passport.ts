import "dotenv/config";
import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type StrategyOptions,
  type JwtFromRequestFunction,
} from "passport-jwt";
import type { Request } from "express";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const jwtOptions: StrategyOptions = {
  jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken() as JwtFromRequestFunction,
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true, // allows access to the Express request in the verify callback
};

passport.use(
  new JwtStrategy(
    jwtOptions,
    async (
      _req: Request,
      payload: any,
      done: (error: any, user?: any) => void,
    ) => {
      try {
        // TODO: find the user from DB once implemented.
        // For example: const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        const user = {
          id: 1,
          name: "furkan",
          payload,
        };

        if (user) return done(null, user);

        return done(null, false);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

export default passport;
