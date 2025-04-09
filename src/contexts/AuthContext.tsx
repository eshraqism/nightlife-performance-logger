
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser, getUser } from '../utils/db';

interface AuthContextType {
  currentUser: { id: string; username: string } | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const userData = await getUser(userId);
        if (userData) {
          setCurrentUser({
            id: userData.id,
            username: userData.username
          });
        } else {
          localStorage.removeItem('userId');
        }
      }
      setIsLoading(false);
    };
    
    initAuth().catch(error => {
      console.error("Auth initialization error:", error);
      setIsLoading(false);
    });
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const userId = await authenticateUser(username, password);
    
    if (userId) {
      const userData = await getUser(userId);
      if (userData) {
        setCurrentUser({
          id: userData.id,
          username: userData.username
        });
        localStorage.setItem('userId', userId);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
