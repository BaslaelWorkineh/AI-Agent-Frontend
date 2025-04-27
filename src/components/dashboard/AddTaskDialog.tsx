import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from '@clerk/clerk-react';
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const AddTaskDialog = ({ onTaskAdded }: { onTaskAdded?: () => void }) => {
  const { getToken } = useAuth();
  const form = useForm<TaskFormData>();
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: TaskFormData) => {
    try {
      const token = await getToken();
      // Prepare request body
      const body = { title: data.title } as { title: string; due?: string };
      if (data.dueDate && !isNaN(Date.parse(data.dueDate))) {
        body.due = new Date(data.dueDate).toISOString();
      }
      const res = await fetch(`${API_URL}/api/tasks/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to add task');
      form.reset();
      if (onTaskAdded) onTaskAdded();
      setOpen(false); // Close the modal after adding task
    } catch (e) {
      alert('Error adding task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Task</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
