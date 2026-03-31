import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import PeerProfile from "./pages/PeerProfile";
import Matches from "./pages/Matches";
import Discover from "./pages/Discover";
import Chat from "./pages/Chat";
import Insights from "./pages/Insights";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import BlockedPeers from "./pages/BlockedPeers";
import Activities from "./pages/Activities";
import SelfCare from "./pages/SelfCare";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:peerId" element={<PeerProfile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/chat/:oderId" element={<Chat />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/blocked-peers" element={<BlockedPeers />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/self-care" element={<SelfCare />} />
            <Route path="/case-study" element={<CaseStudy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
