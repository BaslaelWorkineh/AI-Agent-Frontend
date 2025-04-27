import EmailList from "@/components/dashboard/EmailList";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ScheduleMeeting from "@/components/dashboard/ScheduleMeeting";
import DraftEmail from "@/components/dashboard/DraftEmail";

const Email = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Email</h1>
          <div className="flex gap-2">
            <ScheduleMeeting />
            <DraftEmail />
          </div>
        </div>
        <EmailList />
      </div>
    </DashboardLayout>
  );
};

export default Email;
