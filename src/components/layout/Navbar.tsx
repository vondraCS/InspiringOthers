import { LogOut, Settings as SettingsIcon, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ONBOARDED_KEY } from '@/pages/Onboarding';

export function Navbar() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);

  const handleLogout = () => {
    localStorage.removeItem(ONBOARDED_KEY);
    logout();
    navigate('/onboarding', { replace: true });
  };

  return (
    <header className="h-[100px] flex items-center justify-center shrink-0 border-b border-border relative">
      <Logo size="lg" />
      {currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-9 h-9 rounded-full object-cover bg-image-placeholder ring-1 ring-border-subtle"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <UserRound size={18} strokeWidth={1.75} />
              </span>
            )}
            <span className="font-inter text-sm text-foreground truncate max-w-[140px]">
              {currentUser.fullName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={8}>
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <SettingsIcon size={14} strokeWidth={1.75} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={14} strokeWidth={1.75} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
