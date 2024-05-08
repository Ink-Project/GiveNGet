import { useState, ReactNode } from 'react';
import CurrentUserContext from './CurrentUserContext';

type Props = {
  children: ReactNode;
};

export default function CurrentUserContextProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const context = { currentUser, setCurrentUser };

  return (
    <CurrentUserContext.Provider value={context}>
      {children}
    </CurrentUserContext.Provider>
  );
}
