import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Development mode flag - set to true to bypass Supabase authentication
const DEV_MODE = true;

type UserRole = "admin" | "student" | "faculty";

interface User {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "adminpass"; // This would normally be hashed and stored securely

// Development mode test accounts
const DEV_TEST_ACCOUNTS = [
  { email: "faculty@sriher.edu.in", password: "testpass" },
  { email: "student@sriher.edu.in", password: "testpass" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      if (DEV_MODE) {
        // In dev mode, check localStorage for persisted login
        const savedUser = localStorage.getItem('devUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const email = data.session.user.email;
        if (email) {
          const role = determineUserRole(email);
          setUser({ email, role });
        }
      }
      setIsLoading(false);
    };

    checkUser();

    if (!DEV_MODE) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user.email) {
          const email = session.user.email;
          const role = determineUserRole(email);
          setUser({ email, role });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Determine the user role based on email
  const determineUserRole = (email: string): UserRole => {
    if (email === ADMIN_EMAIL) {
      return "admin";
    } else if (email.endsWith("@sriher.edu.in")) {
      return "faculty";
    } else {
      return "student";
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Special case for admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = { email: ADMIN_EMAIL, role: "admin" as UserRole };
        setUser(adminUser);
        if (DEV_MODE) {
          localStorage.setItem('devUser', JSON.stringify(adminUser));
        }
        toast.success("Admin logged in successfully");
        return true;
      }

      // For regular users, validate the email format
      if (!email.endsWith("@sriher.edu.in") && email !== ADMIN_EMAIL) {
        toast.error("Invalid email domain. Only @sriher.edu.in addresses are allowed.");
        return false;
      }

      if (DEV_MODE) {
        // In dev mode, check against test accounts or allow any valid email
        const isTestAccount = DEV_TEST_ACCOUNTS.some(
          account => account.email === email && account.password === password
        );
        
        if (isTestAccount || password === "testpass") {
          const role = determineUserRole(email);
          const newUser = { email, role };
          setUser(newUser);
          localStorage.setItem('devUser', JSON.stringify(newUser));
          toast.success("Logged in successfully (Development Mode)");
          return true;
        }
        
        toast.error("Invalid credentials");
        return false;
      }

      // Regular login through Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        return false;
      }

      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Prevent signup with admin email
      if (email === ADMIN_EMAIL) {
        toast.error("This email is reserved. Please use a different email address.");
        return false;
      }

      // Validate the email format
      if (!email.endsWith("@sriher.edu.in")) {
        toast.error("Invalid email domain. Only @sriher.edu.in addresses are allowed for registration.");
        return false;
      }

      if (DEV_MODE) {
        // In dev mode, simulate successful signup
        toast.success("Registration successful! (Development Mode)");
        // Auto-login in dev mode
        const role = determineUserRole(email);
        const newUser = { email, role };
        setUser(newUser);
        localStorage.setItem('devUser', JSON.stringify(newUser));
        return true;
      }

      // Register the user with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (DEV_MODE) {
      localStorage.removeItem('devUser');
      setUser(null);
      toast.success("Logged out successfully (Development Mode)");
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
