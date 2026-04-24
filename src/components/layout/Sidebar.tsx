import { NavLink } from 'react-router-dom';
import { Home, User, Compass, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Tooltip } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useUIStore } from '@/store/uiStore';

export function Sidebar() {
  const storedCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  // Below Tailwind's `lg` breakpoint (1024px), force the rail into collapsed
  // mode regardless of the user's stored preference so the app degrades
  // gracefully on tablet-sized viewports.
  const isBelowLg = useMediaQuery('(max-width: 1023.98px)');
  const collapsed = storedCollapsed || isBelowLg;

  return (
    <aside
      className={cn(
        'h-screen bg-primary flex flex-col gap-10 pt-6 shrink-0 transition-all duration-200 ease-in-out',
        collapsed ? 'w-[72px] px-2' : 'w-72 px-6',
      )}
    >
      <div
        className={cn(
          'flex items-start h-[100px]',
          collapsed ? 'justify-center p-0' : 'p-2.5',
        )}
      >
        <Tooltip content={collapsed ? 'Expand menu' : 'Collapse menu'} side="right" disabled={!collapsed}>
          <button
            aria-label="Toggle menu"
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            <Menu size={40} strokeWidth={2} />
          </button>
        </Tooltip>
      </div>

      <nav className="flex-1 flex flex-col gap-5 items-center overflow-hidden">
        <SidebarNavItem to="/" icon={<Home size={30} strokeWidth={2} />} label="Home" collapsed={collapsed} />
        <SidebarNavItem to="/for-you" icon={<User size={30} strokeWidth={2} />} label="For You" collapsed={collapsed} />
        <SidebarNavItem to="/around-you" icon={<Compass size={30} strokeWidth={2} />} label="Around You" collapsed={collapsed} />
      </nav>

      <div className="border-t border-[rgba(2,62,72,0.79)] py-2.5 flex flex-col gap-2 shrink-0">
        <Tooltip content="Settings" side="right" disabled={!collapsed}>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
            className={cn(
              'flex items-center gap-1 h-[45px] rounded-[15px] hover:bg-black/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40',
              collapsed ? 'w-full justify-center px-0' : 'px-2',
            )}
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Settings size={22} strokeWidth={2} />
            </div>
            <span
              className={cn(
                'font-inter font-medium text-base text-black overflow-hidden whitespace-nowrap transition-all duration-200',
                collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto',
              )}
            >
              Settings
            </span>
          </button>
        </Tooltip>
        <div
          className={cn(
            'flex justify-center overflow-hidden transition-all duration-200',
            collapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto',
          )}
        >
          <Logo size="sm" color="black" />
        </div>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Tooltip content={label} side="right" disabled={!collapsed}>
      <NavLink
        to={to}
        end
        aria-label={label}
        className={({ isActive }) =>
          cn(
            'flex items-center rounded-[15px] border-2 border-black transition-colors font-inter text-[22px] text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50',
            collapsed
              ? 'w-[52px] h-[52px] justify-center px-0'
              : 'w-full h-[65px] px-2',
            isActive
              ? 'bg-[rgba(162,252,255,0.5)] font-bold'
              : 'bg-transparent font-semibold hover:bg-black/10',
          )
        }
      >
        <div className="w-12 h-12 flex items-center justify-center shrink-0">{icon}</div>
        <span
          className={cn(
            'whitespace-nowrap overflow-hidden transition-all duration-200',
            collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto',
          )}
        >
          {label}
        </span>
      </NavLink>
    </Tooltip>
  );
}
