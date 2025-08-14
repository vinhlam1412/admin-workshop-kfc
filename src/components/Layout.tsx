import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/AppStore';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state } = useAppStore();
  const location = useLocation();

  // Redirect to login if not authenticated and not on login page
  if (!state.isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // Show login page without layout
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}