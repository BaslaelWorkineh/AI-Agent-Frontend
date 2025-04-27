
import TaskList from "@/components/dashboard/TaskList";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Tasks = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <TaskList />
    </DashboardLayout>
  );
};

export default Tasks;
