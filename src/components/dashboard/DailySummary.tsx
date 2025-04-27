import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DailySummary = () => {
  const { getToken } = useAuth();

  // Fetch calendar events
  const { data: eventsData } = useQuery({
    queryKey: ['calendarEvents-summary'],
    queryFn: async () => {
      const token = await getToken();
      const url = new URL(`${API_URL}/api/calendar/events`);
      // Only fetch today's events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      url.searchParams.append('timeMin', today.toISOString());
      url.searchParams.append('timeMax', tomorrow.toISOString());
      url.searchParams.append('singleEvents', 'true');
      url.searchParams.append('orderBy', 'startTime');
      url.searchParams.append('maxResults', '50');
      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch unread emails
  const { data: emailSummary } = useQuery({
    queryKey: ['email-summary'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/email/summary`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch email summary');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch tasks
  const { data: tasksData } = useQuery({
    queryKey: ['tasks-summary'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const today = new Date();
  const todayEvents = (eventsData?.items || []).filter(event => {
    const start = event.start?.dateTime || event.start?.date;
    if (!start) return false;
    const eventDate = new Date(start);
    return eventDate.toDateString() === today.toDateString();
  });

  const unreadEmails = (emailSummary?.emails || []).filter(email => !email.read);
  const pendingTasks = (tasksData || []).filter(task => !task.status || task.status !== 'completed');

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-lg">Today's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard 
            title="Meetings" 
            value={todayEvents.length.toString()} 
            description={todayEvents.length === 1 ? "meeting today" : "meetings today"}
            className="bg-assistant-light"
          />
          <SummaryCard 
            title="Unread Emails" 
            value={unreadEmails.length.toString()}
            description={unreadEmails.length === 1 ? "email to read" : "emails to read"}
            className="bg-yellow-50"
          />
          <SummaryCard 
            title="Tasks" 
            value={pendingTasks.length.toString()}
            description={pendingTasks.length === 1 ? "task pending" : "tasks pending"}
            className="bg-green-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  className?: string;
}

const SummaryCard = ({ title, value, description, className }: SummaryCardProps) => {
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold">{value}</p>
        <p className="ml-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default DailySummary;
