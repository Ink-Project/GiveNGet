import { createContext } from 'react';

type User = {
  id: string;
  username: string;
};

type ContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const CurrentUserContext = createContext<ContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export default CurrentUserContext;
