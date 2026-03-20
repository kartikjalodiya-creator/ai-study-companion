import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { SubjectsProvider } from "@/contexts/SubjectsContext";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PlannerPage from "./pages/PlannerPage";
import AssistantPage from "./pages/AssistantPage";
import SubjectsPage from "./pages/SubjectsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import GamificationPage from "./pages/GamificationPage";
import FocusPage from "./pages/FocusPage";
import NotesPage from "./pages/NotesPage";
import GroupsPage from "./pages/GroupsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SubjectsProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/focus" element={<FocusPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </SubjectsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
