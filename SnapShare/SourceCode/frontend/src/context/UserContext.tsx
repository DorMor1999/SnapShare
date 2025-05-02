import { createContext, useEffect, useState, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  token: string | null;
  isConnected: boolean;
  setUser: (userId: string, token: string) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  token: null,
  isConnected: false,
  setUser: () => {},
  logout: () => {},
});

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    const now = Date.now() / 1000;
    return exp < now;
  } catch (error) {
    return true;
  }
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    if (storedUserId && storedToken && !isTokenExpired(storedToken)) {
      setUserId(storedUserId);
      setToken(storedToken);
      setIsConnected(true);

      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      const expirationTime = payload.exp * 1000 - Date.now();
      setTimeout(() => logout(), expirationTime);
    } else {
      logout();
    }
  }, []);

  const setUser = (userId: string, token: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    setUserId(userId);
    setToken(token);
    setIsConnected(true);

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000 - Date.now();
    setTimeout(() => logout(), expirationTime);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUserId(null);
    setToken(null);
    setIsConnected(false);
  };

  return (
    <UserContext.Provider value={{ userId, token, isConnected, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
