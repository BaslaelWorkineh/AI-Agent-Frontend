
import React from 'react';
import Sidebar from './Sidebar';
import { useToast } from '@/components/ui/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
