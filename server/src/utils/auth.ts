import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

/** Check if a given password matches a given hash, returns a bool, or undefined if error */
export const isValidPassword = (plaintext: string, hash: string) =>
  bcrypt.compare(plaintext, hash).catch((err) => console.error(err.message));

// Is the user logged in? Not specific user, just ANY user
export const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.session?.userId !== "number") {
    return res.sendStatus(401);
  }

  return next();
};

export const isAuthorized = (userId: number, target?: number) => {
  if (!userId || !target) return false;
  return Number(userId) === target;
};
