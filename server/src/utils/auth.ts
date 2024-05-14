import bcrypt from "bcrypt";

/** Take in a user password and return a hashed password, undefined if error */
export const hashPassword = async (password: string, saltRounds = 8) =>
  bcrypt.hash(password, saltRounds).catch((err) => console.log(err.message));

/** Check if a given password matches a given hash, returns a bool, or undefined if error */
export const isValidPassword = async (plaintext: string, hash: string) =>
  bcrypt.compare(plaintext, hash).catch((err) => console.error(err.message));

export const isAuthorized = (userId: number, target?: number) => {
  if (!userId || !target) return false;
  return Number(userId) === target;
};
