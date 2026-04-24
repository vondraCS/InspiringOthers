import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import Home from '@/pages/Home';
import ForYou from '@/pages/ForYou';
import AroundYou from '@/pages/AroundYou';
import PostDetail from '@/pages/PostDetail';
import UserProfile from '@/pages/UserProfile';
import People from '@/pages/People';
import NotFound from '@/pages/NotFound';
import Onboarding, { ONBOARDED_KEY } from '@/pages/Onboarding';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/ui/toast';

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hasOnboarded =
    typeof window !== 'undefined' && localStorage.getItem(ONBOARDED_KEY) === '1';
  if (!hasOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="*"
              element={
                <OnboardingGuard>
                  <Shell>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/for-you" element={<ForYou />} />
                      <Route path="/around-you" element={<AroundYou />} />
                      <Route path="/posts/:id" element={<PostDetail />} />
                      <Route path="/users/:id" element={<UserProfile />} />
                      <Route path="/people" element={<People />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Shell>
                </OnboardingGuard>
              }
            />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
