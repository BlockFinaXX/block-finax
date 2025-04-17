import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

interface User {
  id: number;
  username: string;
  walletAddress: string | null;
  profileImage: string | null;
  kycStatus: string | null;
  riskScore: number | null;
  kycData: any | null;
}

interface Web3ContextType {
  account: string | null;
  user: User | null;
  balance: string;
  isLoggedIn: boolean;
  isInitializing: boolean;
  error: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
  createAccount: (
    username: string,
    password: string,
    kycData?: any
  ) => Promise<void>;
}

export const Web3Context = createContext<Web3ContextType>({
  account: null,
  user: null,
  balance: "0",
  isLoggedIn: false,
  isInitializing: true,
  error: null,
  loginUser: async () => {},
  logoutUser: () => {},
  createAccount: async () => {},
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { toast } = useToast();

  // State
  const [account, setAccount] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState("0");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the context - check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");

        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
          setAccount(userData.walletAddress);
          setIsLoggedIn(true);

          // Get wallet balance
          if (userData.walletAddress) {
            const balanceResponse = await apiRequest(
              "GET",
              "/api/wallet/balance"
            );
            if (balanceResponse.status === 200) {
              const balanceData = await balanceResponse.json();
              setBalance(balanceData.balance || "0");
            }
          }
        }
      } catch (error) {
        // Not logged in or session expired
        console.log("Not logged in or session expired");
      } finally {
        setIsInitializing(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login user
  const loginUser = async (username: string, password: string) => {
    try {
      setError(null);

      const response = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const userData = await response.json();
        setUser(userData);
        setAccount(userData.walletAddress);
        setIsLoggedIn(true);

        // Get wallet balance
        if (userData.walletAddress) {
          const balanceResponse = await apiRequest(
            "GET",
            "/api/wallet/balance"
          );
          if (balanceResponse.status === 200) {
            const balanceData = await balanceResponse.json();
            setBalance(balanceData.balance || "0");
          }
        }

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.username}!`,
        });
      }
    } catch (error: any) {
      setError(error.message || "Failed to login");
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setUser(null);
      setAccount(null);
      setBalance("0");
      setIsLoggedIn(false);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    }
  };

  // Create account
  const createAccount = async (
    username: string,
    password: string,
    kycData?: any
  ) => {
    try {
      setError(null);

      // Register the user
      const response = await apiRequest("POST", "/api/auth/register", {
        username,
        password,
        kycData,
      });

      if (response.status === 201) {
        const userData = await response.json();
        setUser(userData);
        setAccount(userData.walletAddress);
        setIsLoggedIn(true);

        toast({
          title: "Account Created",
          description: "Your account has been successfully created!",
        });
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account");
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        user,
        balance,
        isLoggedIn,
        isInitializing,
        error,
        loginUser,
        logoutUser,
        createAccount,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
