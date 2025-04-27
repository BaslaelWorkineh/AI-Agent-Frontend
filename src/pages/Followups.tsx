
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Followups = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Follow-ups</h1>
      <div className="grid gap-6">
        <div className="assistant-card">
          <div className="assistant-card-header">
            <h2 className="assistant-card-title">Pending Follow-ups</h2>
          </div>
          <div className="assistant-card-content">
            Coming soon...
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Followups;
