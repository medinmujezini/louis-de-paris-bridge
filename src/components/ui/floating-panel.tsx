import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({ children, className }) => (
  <div className={cn("absolute bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4", className)}>
    {children}
  </div>
);

export const FloatingToolbar: React.FC<FloatingPanelProps> = ({ children, className }) => (
  <div className={cn("absolute bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 flex items-center gap-1", className)}>
    {children}
  </div>
);
