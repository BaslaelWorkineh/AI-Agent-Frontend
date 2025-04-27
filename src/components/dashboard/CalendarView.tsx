import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Terminal } from "lucide-react"; // Import icon for Alert
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleMeeting from './ScheduleMeeting';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Define the expected structure of a Google Calendar event item
type GoogleCalendarEvent = {
  id: string;
  summary: string; // Title of the event
  start: {
    dateTime?: string; // For timed events
    date?: string;     // For all-day events
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: { email: string; responseStatus: string }[];
};

// Helper function to get a consistent start date string
const getEventStartDate = (event: GoogleCalendarEvent): string => {
  return event.start.dateTime || event.start.date || '';
};

// Helper function to get a consistent end date string
const getEventEndDate = (event: GoogleCalendarEvent): string => {
  return event.end.dateTime || event.end.date || '';
};


const CalendarView = () => {
  const { getToken } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date()); // Use state for the displayed date
  const queryClient = useQueryClient();
  const scheduleDialogRef = useRef<any>(null);

  // Fetch calendar events using react-query
  const { data: eventsData, isLoading, error, isError } = useQuery<{ items: GoogleCalendarEvent[] }, Error>({
    queryKey: ['calendarEvents', currentDate.toDateString()], // Re-fetch if currentDate changes (though we filter client-side for now)
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available.');
      }
      // Adjust the timeMin and timeMax based on the 'currentDate' if needed for backend filtering
      // For simplicity, fetching a broader range and filtering client-side here
      const timeMin = new Date(currentDate);
      timeMin.setHours(0, 0, 0, 0); // Start of the day
      const timeMax = new Date(currentDate);
      timeMax.setDate(timeMax.getDate() + 7); // Fetch for the next 7 days
      timeMax.setHours(23, 59, 59, 999);

      // Construct the URL with query parameters
      const url = new URL(`${API_URL}/api/calendar/events`);
      url.searchParams.append('timeMin', timeMin.toISOString());
      url.searchParams.append('timeMax', timeMax.toISOString()); // Add timeMax if your backend supports it
      url.searchParams.append('singleEvents', 'true');
      url.searchParams.append('orderBy', 'startTime');
      url.searchParams.append('maxResults', '50'); // Fetch more to allow client-side filtering

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error details
        throw new Error(errorData.error || `Failed to fetch calendar events: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const events = eventsData?.items || [];

  // Filter events for the currently displayed date (client-side)
  const todayEvents = events.filter(event => {
    const eventStartDate = getEventStartDate(event);
    if (!eventStartDate) return false;
    const eventDate = new Date(eventStartDate);
    // Handle both date and dateTime formats
    return eventDate.toDateString() === currentDate.toDateString();
  });

  // Filter for upcoming events (after the current date, limit to 3 for display)
  const upcomingEvents = events.filter(event => {
    const eventStartDate = getEventStartDate(event);
    if (!eventStartDate) return false;
    const eventDate = new Date(eventStartDate);
    // Ensure the event is strictly after the current date's end
    const currentEndOfDay = new Date(currentDate);
    currentEndOfDay.setHours(23, 59, 59, 999);
    return eventDate > currentEndOfDay;
  }).slice(0, 3); // Limit to 3 upcoming events for the UI

  // --- TODO: Implement date navigation logic ---
  const handlePreviousDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };
  // --- End TODO ---

  // Handler to refresh events after scheduling
  const handleMeetingScheduled = () => {
    queryClient.invalidateQueries(['calendarEvents']);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <ScheduleMeeting onScheduled={handleMeetingScheduled} ref={scheduleDialogRef} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle>
                {currentDate.toDateString() === new Date().toDateString() ? "Today's Schedule" : "Schedule"}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
             {/* Add Day Navigation Buttons */}
             <div className="flex items-center justify-end space-x-1">
                 <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePreviousDay} aria-label="Previous day">
                    <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                 </Button>
                 <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextDay} aria-label="Next day">
                    <ChevronRight className="h-4 w-4" />
                 </Button>
             </div>
            <CardDescription>
              Your meetings and events for the selected day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading State using Skeletons
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : isError ? (
              // Error State using Alert
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Fetching Events</AlertTitle>
                <AlertDescription>
                  {/* {error?.message || "Could not load calendar events. Please try again later."} */}
                  Failed to fetch
                </AlertDescription>
              </Alert>
            ) : todayEvents.length > 0 ? (
              // Display Events
              <div className="space-y-4">
                {todayEvents.map((event) => {
                  const startDate = new Date(getEventStartDate(event));
                  const isAllDay = !event.start.dateTime; // Check if it's an all-day event

                  return (
                    <div key={event.id} className="flex border-l-4 border-assistant pl-4 py-2">
                      <div className="w-24 flex-shrink-0">
                        <div className="text-sm font-medium">
                          {isAllDay
                            ? "All Day"
                            : startDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{event.summary || '(No title)'}</div>
                        {event.location && <div className="text-sm text-muted-foreground">{event.location}</div>}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            With: {event.attendees.map(a => a.email).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // No Events State
              <div className="text-center py-8 text-muted-foreground">
                <p>No meetings scheduled for this day</p>
                <Button variant="link" className="mt-2 text-assistant" onClick={() => scheduleDialogRef.current?.open?.()}>Schedule a meeting</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events Card - Remains largely the same but uses fetched data */}
        <Card className="w-full lg:w-80">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming</CardTitle>
              {/* Keep navigation for upcoming if needed, or remove if always shows next 3 */}
               {/*
               <div className="flex">
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                   <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
               */}
            </div>
            <CardDescription>Your next few events</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
             ) : isError ? (
                 <div className="text-center py-4 text-destructive text-sm">
                    {/* Error loading upcoming events. */}
                    Failed to fetch
                 </div>
             ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => {
                   const startDate = new Date(getEventStartDate(event));
                   return (
                      <div key={event.id} className="flex border-l-4 border-muted pl-4 py-2">
                        <div>
                          <div className="text-sm font-medium">
                            {startDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="font-medium mt-1">{event.summary || '(No title)'}</div>
                        </div>
                      </div>
                   );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No upcoming meetings found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
