import { Logo } from './Logo';

export function Navbar() {
  return (
    <header className="h-[100px] flex items-center justify-center shrink-0 border-b border-gray-100">
      <Logo size="lg" />
    </header>
  );
}
