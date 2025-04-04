
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
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of allowed admin emails
const ALLOWED_ADMIN_EMAILS = [
  "santiyawilliam@gmail.com",
  // Add the other 4 admin emails here when they're provided
];

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
    if (ALLOWED_ADMIN_EMAILS.includes(email)) {
      return "admin";
    } else if (email.endsWith("@sriher.edu.in")) {
      // Differentiate between student and faculty based on some convention if needed
      // For now, all @sriher.edu.in emails that aren't admin are considered students
      return "student";
    } else {
      // This should not happen with proper validation in the login function
      return "student";
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Validate the email format
      if (!ALLOWED_ADMIN_EMAILS.includes(email) && !email.endsWith("@sriher.edu.in")) {
        toast.error("Invalid email domain. Only @sriher.edu.in addresses are allowed.");
        return false;
      }

      // Determine if the user is an admin
      const isAdmin = ALLOWED_ADMIN_EMAILS.includes(email);

      // For admin, require password
      if (isAdmin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          return false;
        }

        toast.success("Admin logged in successfully");
        return true;
      }
      
      // For students/faculty, allow email login
      else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          toast.error(error.message);
          return false;
        }

        toast.success("Login link sent to your email");
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
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
