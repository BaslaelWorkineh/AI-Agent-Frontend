import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Import useNavigate
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"; // Import Clerk components
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Email from "./pages/Email";
import Tasks from "./pages/Tasks";
import Briefs from "./pages/Briefs";
import Followups from "./pages/Followups";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";

const queryClient = new QueryClient();

// Clerk Publishable Key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function ClerkAppWrapper() {
  const navigate = useNavigate();

  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<Landing />} />
            {/* Documentation page */}
            <Route path="/docs" element={<Docs />} />
            {/* Protected dashboard and other routes */}
            <Route
              path="/*"
              element={
                <>
                  <SignedIn>
                    <Routes>
                      <Route path="/dashboard" element={<Index />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/email" element={<Email />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/briefs" element={<Briefs />} />
                      <Route path="/followups" element={<Followups />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const App = () => (
  <BrowserRouter>
    <ClerkAppWrapper />
  </BrowserRouter>
);

export default App;
