import { fetchHandler, getPostOptions, deleteOptions } from "../utils";

const baseUrl = '/api';

type LoggedInUserData = {
  id: number;
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

export const logUserIn = async ({ username, password }: LoginParams): Promise<void> => {
  await fetchHandler(`${baseUrl}/login`, getPostOptions({ username, password }));
};

export const logUserOut = async (): Promise<boolean> => {
  await fetchHandler(`${baseUrl}/logout`, deleteOptions);
  return true;
};
