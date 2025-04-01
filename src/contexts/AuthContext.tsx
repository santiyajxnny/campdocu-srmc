
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type UserRole = "admin" | "student";

interface User {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // For admin login, validate both email and password
      if (email === "admin@admin.com") {
        if (password === "adminpass") {
          const adminUser = { email, role: "admin" as UserRole };
          setUser(adminUser);
          localStorage.setItem("user", JSON.stringify(adminUser));
          toast.success("Admin logged in successfully");
          return true;
        } else {
          toast.error("Invalid admin credentials");
          return false;
        }
      }
      
      // For student login with domain validation
      else if (email.endsWith("@srmc.com")) {
        // For student accounts, we don't need a password
        const studentUser = { email, role: "student" as UserRole };
        setUser(studentUser);
        localStorage.setItem("user", JSON.stringify(studentUser));
        toast.success("Student logged in successfully");
        return true;
      } else {
        toast.error("Invalid email domain. Use an institutional email.");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
