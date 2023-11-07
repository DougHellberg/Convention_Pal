import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserSessionProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null)

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
    <UserContext.Provider value={(name,setName)}>
      {children}
    </UserContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
