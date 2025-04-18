"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define the shape of our context
interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  isKYCCompleted: boolean;
  kycStatus: string;
}

// Create the context with default values
export const AppContext = createContext<AppContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
  isKYCCompleted: false,
  kycStatus: "PENDING",
});

// Props for the provider component
interface AppProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for KYC status (this would typically come from user data)
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [kycStatus, setKYCStatus] = useState("PENDING");

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check for mobile view and adjust sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Run once on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        isKYCCompleted,
        kycStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
