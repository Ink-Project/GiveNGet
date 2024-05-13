import { useState, ReactNode } from "react";
import CurrentUserContext from "./CurrentUserContext";

type Props = {
  children: ReactNode; // Children components
};

// Component to provide CurrentUserContext throughout the application
export default function CurrentUserContextProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<any>(null); // State for current user
  const context = { currentUser, setCurrentUser }; // Context object

  return (
    // Providing CurrentUserContext with context value to its children
    <CurrentUserContext.Provider value={context}>{children}</CurrentUserContext.Provider>
  );
}
