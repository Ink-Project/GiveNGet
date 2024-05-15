import { fetchHandler, getPostOptions } from "../utils/utils";

/** Base URL for user API endpoints */
const baseUrl = "/api/v1/users";

type User = {
  id: string;
  username: string;
};

type CreateUserParams = {
  username: string;
  password: string;
};

// Creates a new user with the provided username and password.
export const createUser = async ({ username, password }: CreateUserParams): Promise<any> => (
  fetchHandler(baseUrl, getPostOptions({ username, password }))
);

// Retrieves all users
export const getAllUsers = async (): Promise<User[]> => {
  const [users] = await fetchHandler(baseUrl);
  return users || [];
};

// returns user based on id
export const getUser = (id: string) => {
  return fetchHandler(`${baseUrl}/${id}`);
};
