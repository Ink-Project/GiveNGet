import { hashPassword } from "../utils/auth";
import model, { RowType } from "../utils/model";
import { z } from "zod";

export type User = RowType<typeof users>;

const users = model(
  "users",
  "id",
  z.object({
    id: z.number().optional(),
    username: z.string(),
    password: z.string(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  }),
  (data) => {
    // @ts-expect-error 2339
    data.toJSON = function () {
      return { ...this, password: undefined, updated_at: undefined };
    };
    return data;
  }
);

export const list = () => users.list();

export const find = (id: number) => users.findBy("id", id);

export const findByUsername = (username: string) => users.findBy("username", username);

export const create = async (username: string, password: string) => {
  const hashed = await hashPassword(password);
  if (!hashed) {
    return;
  }
  return await users.create({ username, password: hashed });
};

export const update = async (user: User, username: string) => {
  return await users.update(user, { username });
};

export const deleteAll = () => users.deleteAll();
