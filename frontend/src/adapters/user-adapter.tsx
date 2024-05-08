import { fetchHandler, getPostOptions, getPatchOptions } from "../utils";

const baseUrl = '/api/users';

type User = {
  id: string;
  username: string;
};

type CreateUserParams = {
  username: string;
  password: string;
};

export const createUser = async ({ username, password }: CreateUserParams): Promise<any> => (
  fetchHandler(baseUrl, getPostOptions({ username, password }))
);

export const getAllUsers = async (): Promise<User[]> => {
  const [users] = await fetchHandler(baseUrl);
  return users || [];
};

export const getUser = async (id: string): Promise<User | null> => {
  const [user] = await fetchHandler(`${baseUrl}/${id}`);
  return user || null;
};

type UpdateUsernameParams = {
  id: string;
  username: string;
};

export const updateUsername = async ({ id, username }: UpdateUsernameParams): Promise<void> => {
  await fetchHandler(`${baseUrl}/${id}`, getPatchOptions({ id, username }));
};
