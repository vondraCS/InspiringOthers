import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuthStore } from '@/store/authStore';
import { ONBOARDED_KEY } from '@/pages/Onboarding';

export function Navbar() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    localStorage.removeItem(ONBOARDED_KEY);
    logout();
    navigate('/onboarding', { replace: true });
  };

  return (
    <header className="h-[100px] flex items-center justify-center shrink-0 border-b border-gray-100 relative">
      <Logo size="lg" />
      {currentUser && (
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-inter text-sm text-black/70 hover:text-black border border-black/20 rounded-full px-3 py-1.5 hover:bg-black/5 cursor-pointer"
        >
          <LogOut size={14} strokeWidth={2} />
          Log out
        </button>
      )}
    </header>
  );
}
