import { z } from "zod";
import bcrypt from "bcrypt";
import model, { RowType } from "../utils/model";
import { processImage } from "../utils/image";

export type User = RowType<typeof users>;

const users = model(
  "users",
  "id",
  z.object({
    id: z.number().optional(),
    username: z.string(),
    password: z.string(),
    full_name: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    profile_image: z.string().nullish(),
  }),
  (data) => {
    // @ts-expect-error 2339
    data.toJSON = function () {
      return { ...this, password: undefined, updated_at: undefined };
    };
    return data;
  }
);

const hashPassword = (plaintext: string) =>
  bcrypt.hash(plaintext, 10).catch((err) => console.log(err.message));

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

export const update = async (
  self: User,
  username?: string,
  password?: string,
  full_name?: string,
  profile_image?: string
) => {
  const obj: Parameters<typeof users.update>[1] = {};
  if (profile_image !== undefined) {
    obj.profile_image = await processImage(profile_image);
  }

  if (password !== undefined) {
    const next = await hashPassword(password);
    if (!next) {
      return;
    }
    obj.password = next;
  }

  if (username !== undefined) {
    obj.username = username;
  }

  if (full_name !== undefined) {
    obj.full_name = full_name;
  }

  return await users.update(self, obj);
};

export const deleteAll = () => users.deleteAll();
