import { fetchHandler, getPostOptions } from "../utils/utils";

/** Base URL for user API endpoints */
const baseUrl = "/api/v1/users";

type User = {
  id: string;
  fullName: string;
  username: string;
};

type CreateUserParams = {
  full_name: string;
  username: string;
  password: string;
};

// Creates a new user with the provided username and password.
export const createUser = async ({ full_name, username, password }: CreateUserParams): Promise<any> => {
  return fetchHandler(baseUrl, getPostOptions({ full_name, username, password }));
};

// Retrieves all users
export const getAllUsers = async (): Promise<User[]> => {
  const [users] = await fetchHandler(baseUrl);
  return users || [];
};

// returns user based on id
export const getUser = (id: string) => {
  return fetchHandler(`${baseUrl}/${id}`);
};
