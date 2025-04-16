import React, { createContext, useState, ReactNode } from "react";

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const AppContext = createContext<AppContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
