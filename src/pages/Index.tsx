
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DailySummary from '@/components/dashboard/DailySummary';
import CalendarView from '@/components/dashboard/CalendarView';
import EmailSummary from '@/components/dashboard/EmailSummary';
import TaskList from '@/components/dashboard/TaskList';
import AICommandInput from '@/components/dashboard/AICommandInput';
import ApiConfigSection from '@/components/dashboard/ApiConfigSection';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold lg:text-4xl" style={{color:'#4f46e5'}}>
            TINA the AI Executive Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Your intelligent assistant for managing emails, calendar, tasks and more
          </p>
        </header>
        
        <AICommandInput />
        
        <Separator className="my-8" />
        
        <div className="mb-8">
          <DailySummary />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EmailSummary />
          <TaskList />
        </div>
        
        <div className="mb-8">
          <CalendarView />
        </div>
        
        {/* <div className="mb-8">
          <ApiConfigSection />
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default Index;
