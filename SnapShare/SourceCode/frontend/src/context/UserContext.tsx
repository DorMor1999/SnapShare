import { createContext, useEffect, useState, ReactNode, useRef } from 'react';

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

  const logoutTimeoutRef = useRef<number | null>(null);

  const clearLogoutTimeout = () => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
  };

  const scheduleLogout = (token: string) => {
    clearLogoutTimeout();
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000 - Date.now();
      if (expirationTime > 0) {
        logoutTimeoutRef.current = setTimeout(() => logout(), expirationTime);
      }
    } catch {}
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    if (storedUserId && storedToken && !isTokenExpired(storedToken)) {
      setUserId(storedUserId);
      setToken(storedToken);
      setIsConnected(true);
      scheduleLogout(storedToken);
    } else {
      logout();
    }
    // Cleanup on unmount
    return clearLogoutTimeout;
  }, []);

  const setUser = (userId: string, token: string) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    setUserId(userId);
    setToken(token);
    setIsConnected(true);
    scheduleLogout(token);
  };

  const logout = () => {
    clearLogoutTimeout();
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUserId(null);
    setToken(null);
    setIsConnected(false);
  };

  return (
    <UserContext.Provider
      value={{ userId, token, isConnected, setUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
