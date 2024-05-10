import { fetchHandler, getPostOptions, deleteOptions } from "../utils";

const baseUrl = "/api/v1";

type LoggedInUserData = {
  id: string;
  username: string;
};

type LoginParams = {
  username: string;
  password: string;
};

// Checks if there is a logged-in user.
export const checkForLoggedInUser = async (): Promise<LoggedInUserData | null> => {
  const [data] = await fetchHandler(`${baseUrl}/me`);
  return data || null;
};

// Logs a user in with the provided username and password.
export const logUserIn = async ({ username, password }: LoginParams): Promise<any> => {
  return fetchHandler(`${baseUrl}/login`, getPostOptions({ username, password }));
};

// logs out the current user that is logged in
export const logUserOut = async (): Promise<any> => {
  return fetchHandler(`${baseUrl}/logout`, deleteOptions);
};
