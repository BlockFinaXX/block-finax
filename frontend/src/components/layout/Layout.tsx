import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { AppProvider } from '../../context/AppContext';
import { Web3Provider } from '../../context/Web3Context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import { Toaster } from '../ui/toaster';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <AppProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <Sidebar />
            
            <main className="pt-16 transition-all duration-300 lg:pl-64">
              <div className="container mx-auto p-4 md:p-6">
                {children}
              </div>
            </main>
            
            <Toaster />
          </div>
        </AppProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
};

export default Layout;