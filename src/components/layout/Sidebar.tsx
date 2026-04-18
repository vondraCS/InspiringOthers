import { NavLink } from 'react-router-dom';
import { Home, User, Compass, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { useUIStore } from '@/store/uiStore';

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);

  return (
    <aside
      className={cn(
        'h-screen bg-[#2ECB71] flex flex-col gap-10 pt-6 shrink-0 transition-all duration-200',
        collapsed ? 'w-[72px] px-2' : 'w-72 px-6',
      )}
    >
      <div
        className={cn(
          'flex items-start h-[100px]',
          collapsed ? 'justify-center p-0' : 'p-2.5',
        )}
      >
        <button
          aria-label="Toggle menu"
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
        >
          <Menu size={40} strokeWidth={2} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-5 items-center overflow-hidden">
        <SidebarNavItem to="/" icon={<Home size={30} strokeWidth={2} />} label="Home" collapsed={collapsed} />
        <SidebarNavItem to="/for-you" icon={<User size={30} strokeWidth={2} />} label="For You" collapsed={collapsed} />
        <SidebarNavItem to="/around-you" icon={<Compass size={30} strokeWidth={2} />} label="Around You" collapsed={collapsed} />
      </nav>

      <div className="border-t border-[rgba(2,62,72,0.79)] py-2.5 flex flex-col gap-2 shrink-0">
        <button
          type="button"
          aria-label="Settings"
          title={collapsed ? 'Settings' : undefined}
          onClick={() => setSettingsOpen(true)}
          className={cn(
            'flex items-center gap-1 h-[45px] rounded-[15px] hover:bg-black/10 transition-colors cursor-pointer',
            collapsed ? 'justify-center px-0' : 'px-2',
          )}
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <Settings size={22} strokeWidth={2} />
          </div>
          {!collapsed && (
            <span className="font-inter font-medium text-base text-black">Settings</span>
          )}
        </button>
        {!collapsed && (
          <div className="flex justify-center">
            <Logo size="sm" color="black" />
          </div>
        )}
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
    <NavLink
      to={to}
      end
      aria-label={label}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center rounded-[15px] border-2 border-black transition-colors font-inter text-[22px] text-black',
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
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
}
