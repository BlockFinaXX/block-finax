
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppContext } from '../../hooks/useAppContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-[170px]">
          <main className="container mx-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
