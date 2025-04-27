
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DailySummary from "@/components/dashboard/DailySummary";

const Briefs = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Daily Briefs</h1>
      <DailySummary />
    </DashboardLayout>
  );
};

export default Briefs;
