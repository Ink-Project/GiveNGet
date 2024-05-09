import { fetchHandler, getPostOptions } from "../utils";

const baseUrl = "/api/v1/users";

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

export const getUser = async (id: string): Promise<any> => {
  const [user] = await fetchHandler(`${baseUrl}/${id}`);
  return user || null;
};
