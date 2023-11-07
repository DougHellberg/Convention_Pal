import React, { createContext, useContext, useState } from 'react';
import InventoryList from './InventoryList';

const UserSessionContext = createContext();

export const UserSessionProvider = ({ children }) => {
    const [userSession, setUserSession] = useState(null);
    const [error, setError] = useState(null); 


    const login = (userData) => {
    console.log('Logging in user with ID:', userData.user_id);
    if (userData && userData.user_id) {
        setUserSession(userData);
        setError(null); 
    } else {
        setError('Invalid login credentials. Please try again.'); 
    }
};

    const logout = () => {
    setUserSession(null);
    };

return (
  <UserSessionContext.Provider value={{ userSession, login, logout }}>
  
  {children}
</UserSessionContext.Provider>
);
};

export const useUserSession = () => {
    return useContext(UserSessionContext);
};
