
import React from 'react';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface LayoutProps {
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = false }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      <footer className="py-6 border-t">
        <div className="container flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Movie Explorer. Powered by TMDB.
          </p>
        </div>
      </footer>
      <Toaster />
      <SonnerToaster />
    </div>
  );
};

export default Layout;
