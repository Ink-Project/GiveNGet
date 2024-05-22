import { createContext } from 'react';

type User = {
  id: string;
  username: string;
  full_name: string;
};

type ContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void; // Function to set current user
};

// Creating context with initial values
const CurrentUserContext = createContext<ContextType>({
  currentUser: null,
  setCurrentUser: () => {}, // Default function does nothing
});

export default CurrentUserContext;
