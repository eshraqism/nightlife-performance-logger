
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import ReportPage from "./pages/ReportPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Index />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/create" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <CreateEvent />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/event/:id" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <EventDetail />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <ReportPage />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
