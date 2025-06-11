import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/verify-session`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isValid) {
          setUser({ id: data.userId, role: data.role });
          return true;
        }
      }
      setUser(null);
      return false;
    } catch (error) {
      console.error('Session verification error:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? `${baseUrl}/auth/admin/signin` : `${baseUrl}/auth/signin`;
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Immediately set user state with the data from successful login
      setUser({ id: data.userId, role: data.role });
      
      // Return the full data for the component to use
      return { 
        success: true, 
        role: data.role,
        userId: data.userId 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${baseUrl}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      loading,
      login,
      logout,
      verifySession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);