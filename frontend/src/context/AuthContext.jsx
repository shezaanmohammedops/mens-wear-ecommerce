import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("menswear_user");
    const savedToken = localStorage.getItem("menswear_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("menswear_user");
        localStorage.removeItem("menswear_token");
      }
    } else {
      localStorage.removeItem("menswear_user");
      localStorage.removeItem("menswear_token");
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    if (!token) {
      return;
    }

    localStorage.setItem(
      "menswear_user",
      JSON.stringify(userData)
    );

    localStorage.setItem("menswear_token", token);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("menswear_user");
    localStorage.removeItem("menswear_token");

    setUser(null);
  };

  const isAuthenticated =
    !!user && !!localStorage.getItem("menswear_token");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthProvider;