import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from '@clerk/clerk-react';

const meetingSchema = z.object({
  title: z.string().min(1, "Meeting title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

const ScheduleMeeting = React.forwardRef(({ onScheduled }: { onScheduled?: () => void }, ref) => {
  const { getToken } = useAuth();
  const form = useForm<MeetingFormData>();
  const [open, setOpen] = React.useState(false);
  React.useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));

  const onSubmit = async (data: MeetingFormData) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      // Combine date and time into ISO strings
      const start = new Date(`${data.date}T${data.time}`);
      const end = new Date(start.getTime() + parseInt(data.duration) * 60000);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/calendar/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary: data.title,
          start: start.toISOString(),
          end: end.toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to schedule meeting');
      setOpen(false);
      form.reset();
      onScheduled?.();
    } catch (e) {
      alert('Error scheduling meeting');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meeting title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min="15" step="15" placeholder="30" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Schedule Meeting</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default ScheduleMeeting;
