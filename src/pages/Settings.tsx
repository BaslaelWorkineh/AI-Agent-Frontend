import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Settings = () => {
  const [slackWebhook, setSlackWebhook] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  // Fetch user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/user-settings`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSlackWebhook(data?.zapier_webhook_url || "");
        setUserEmail(data?.email || "");
        setLoading(false);
      } catch (err) {
        setError("Could not load settings");
        setLoading(false);
      }
    };
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/user-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ zapierWebhookUrl: slackWebhook, email: userEmail }),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError("Failed to save settings");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSave} className="bg-white shadow-md rounded-lg p-8 max-w-lg space-y-8 border border-gray-200">
        <div>
          <h2 className="text-xl font-semibold mb-2">Zapier Integration</h2>
          <p className="text-gray-600 mb-4 text-sm">
            To receive notifications (e.g., Morning Brief, End-of-Day Recap) in Slack or email, create a Zap in Zapier with a <b>Catch Hook</b> trigger and paste the webhook URL below. <br />
            <span className="text-xs text-gray-500">(You can find this in your Zap's trigger step.)</span>
          </p>
          <label className="block font-medium mb-1">Zapier Webhook URL</label>
          <input
            type="text"
            value={slackWebhook}
            onChange={e => setSlackWebhook(e.target.value)}
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            className="input input-bordered w-full mb-4"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Your Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            placeholder="you@example.com"
            className="input input-bordered w-full"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
          disabled={loading}
        >
          {loading ? "Loading..." : "Save"}
        </button>
        {saved && <div className="text-green-600 font-medium mt-2">Settings saved!</div>}
        {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
      </form>
    </DashboardLayout>
  );
};

export default Settings;
