
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Contexts
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { MovieProvider } from "@/context/MovieContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Search from "@/pages/Search";
import Trending from "@/pages/Trending";
import Favorites from "@/pages/Favorites";
import Wishlist from "@/pages/Wishlist";
import MovieDetails from "@/pages/MovieDetails";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>
                
                <Route element={<Layout requireAuth={true} />}>
                  <Route path="/favorites" element={<Favorites />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
