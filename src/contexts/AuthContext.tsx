
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
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
  }, []);

  // Determine the user role based on email
  const determineUserRole = (email: string): UserRole => {
    if (email === ADMIN_EMAIL) {
      return "admin";
    } else if (email.endsWith("@sriher.edu.in")) {
      return "faculty"; // Changed from student to faculty as default for sriher.edu.in emails
    } else {
      // This should not happen with proper validation in the login function
      return "student";
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Special case for admin login - using hardcoded values first
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log("Admin login attempt with correct credentials");
        
        // For admin, we'll create a custom session
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Admin login error:", error);
          toast.error("Admin login failed: " + error.message);
          return false;
        }

        if (data.user) {
          console.log("Admin authenticated successfully");
          setUser({ email: ADMIN_EMAIL, role: "admin" });
          toast.success("Admin logged in successfully");
          return true;
        }
      }

      // For regular users, validate the email format
      if (!email.endsWith("@sriher.edu.in") && email !== ADMIN_EMAIL) {
        toast.error("Invalid email domain. Only @sriher.edu.in addresses are allowed.");
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      toast.info("Logged out successfully");
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
