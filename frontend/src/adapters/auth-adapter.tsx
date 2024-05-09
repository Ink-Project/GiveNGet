import { fetchHandler, getPostOptions } from "../utils";

const baseUrl = "/api/v1";

type LoggedInUserData = {
  id: string;
  username: string;
};

type LoginParams = {
  username: string;
  password: string;
};

export const checkForLoggedInUser = async (): Promise<LoggedInUserData | null> => {
  const [data] = await fetchHandler(`${baseUrl}/me`);
  return data || null;
};

export const logUserIn = async ({ username, password }: LoginParams): Promise<any> => {
  return fetchHandler(`${baseUrl}/login`, getPostOptions({ username, password }));
};

// export const logUserOut = async (): Promise<any> => {
//   return fetchHandler(`${baseUrl}/logout`, deleteOptions);
// };
