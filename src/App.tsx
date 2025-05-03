
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import IndexPage from "./pages/Index";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";
import MyBidsPage from "./pages/MyBidsPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!user) return <Navigate to="/auth" />;
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/my-auctions" element={
                <ProtectedRoute>
                  <MyAuctionsPage />
                </ProtectedRoute>
              } />
              <Route path="/my-bids" element={
                <ProtectedRoute>
                  <MyBidsPage />
                </ProtectedRoute>
              } />
              <Route path="/auctions/:id" element={<AuctionDetailPage />} />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateAuctionPage />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
