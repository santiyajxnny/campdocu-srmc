
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-destructive">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate("/")}>Return to Home</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>Return to Login</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
