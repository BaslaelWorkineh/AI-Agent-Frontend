
import CalendarView from "@/components/dashboard/CalendarView";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Calendar = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <CalendarView />
    </DashboardLayout>
  );
};

export default Calendar;
