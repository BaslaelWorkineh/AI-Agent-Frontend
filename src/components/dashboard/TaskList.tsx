import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AddTaskDialog from './AddTaskDialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const TaskList = () => {
  const { getToken } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
  const tasks = data || [];

  // No toggleTask since Google Tasks API would need PATCH for completion
  // Only show incomplete tasks (as per backend)
  const handleComplete = async (taskId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to complete task');
      refetch();
    } catch (e) {
      alert('Failed to mark task as done');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Tasks</CardTitle>
          <AddTaskDialog onTaskAdded={refetch} />
        </div>
        <CardDescription>
          Your priority tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div className="text-destructive">Failed to load tasks</div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-4 p-2">
                <Checkbox
                  checked={!!task.status && task.status === 'completed'}
                  disabled={task.status === 'completed'}
                  className="mt-1"
                  onCheckedChange={() => handleComplete(task.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  {task.notes && <p className="text-xs text-muted-foreground">{task.notes}</p>}
                  {task.due && (
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(task.due).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>All caught up! No pending tasks.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
