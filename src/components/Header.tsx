import React from 'react';
import { useAppStore } from '@/store/AppStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { state } = useAppStore();

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          KFC Workshop Management
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">
          Welcome back, {state.user?.email}
        </span>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {state.user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}