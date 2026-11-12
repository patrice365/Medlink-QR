import React, { useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ActivityIcon, BuildingIcon, LogOutIcon, PanelLeftIcon, SearchIcon, UsersIcon, BoxIcon } from "lucide-react";
import { useRecords } from "../contexts/RecordsContext";
import { BrandMark } from "./BrandMark";
interface NavItem {
  to: string;
  label: string;
  icon: typeof BoxIcon;
  end?: boolean;
}
const NAV_ITEMS: NavItem[] = [{
  to: '/clinic',
  label: 'Patient records',
  icon: UsersIcon,
  end: true
}, {
  to: '/clinic/triage',
  label: 'AI triage',
  icon: ActivityIcon
}];
export function StaffLayout() {
  const {
    role,
    level,
    signOut
  } = useRecords();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  if (role !== 'clinic') return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  const levelLabel = level === 'physician' ? 'Head physician' : 'Clinic staff';
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/clinic?q=${encodeURIComponent(search.trim())}`);
  };
  const renderItem = (item: NavItem, mode: 'side' | 'bar') => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setExpanded(false)} title={item.label} className={({
    isActive
  }) => `relative flex min-h-[44px] items-center gap-3 whitespace-nowrap rounded-full px-1.5 pr-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${isActive ? 'bg-tint text-brand-royal' : 'text-ink-soft hover:bg-tint/50 hover:text-ink'}`}>
      {({
      isActive
    }) => <>
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isActive ? 'bg-white text-brand-royal' : 'bg-tint text-brand-royal'}`} aria-hidden="true">
            <item.icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className={mode === 'side' && !expanded ? 'md:sr-only lg:not-sr-only' : ''}>{item.label}</span>
          {isActive && mode === 'side' && <span className="absolute -left-4 bottom-2 top-2 w-[3px] rounded-r-full bg-brand-gold" aria-hidden="true" />}
        </>}
    </NavLink>;
  return <div className="min-h-screen w-full bg-canvas">
      <header className="bg-lnu-header sticky top-0 z-40 h-16">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          <button type="button" onClick={() => setExpanded((v) => !v)} aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={expanded} className="hidden h-11 w-11 place-items-center rounded-full text-white/90 transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 md:grid lg:hidden">
            <PanelLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <BrandMark inverted />
          <form onSubmit={submitSearch} role="search" className="ml-auto hidden w-full max-w-sm md:block lg:ml-10 lg:mr-auto">
            <label htmlFor="global-search" className="sr-only">
              Search patients
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
              <input id="global-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients, student no., clinic no." className="h-10 w-full rounded-full border border-white/10 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/60 transition-[background-color,border-color] duration-150 focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/10" />
            </div>
          </form>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <span className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white xl:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
              {levelLabel}
            </span>
            <button type="button" onClick={handleSignOut} className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-white/90 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20">
              <LogOutIcon className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      </header>

      {expanded && <div className="fixed inset-0 top-16 z-20 hidden bg-brand-navy/20 md:block lg:hidden" onClick={() => setExpanded(false)} aria-hidden="true" />}

      <aside className={`fixed bottom-0 left-0 top-16 z-30 hidden flex-col border-r border-line bg-white transition-[width] duration-200 ease-out md:flex lg:w-64 lg:shadow-none ${expanded ? 'w-64 shadow-pop' : 'w-20'}`}>
        <div className={`bg-brand-navy px-5 pb-6 pt-3 ${expanded ? 'block' : 'hidden'} lg:block`}>
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] p-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-brand-gold">
              <BuildingIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Health Services Office</p>
              <p className="truncate text-xs text-white/60">{levelLabel}</p>
            </div>
          </div>
        </div>
        <nav aria-label="Staff navigation" className="flex flex-col gap-1 p-4">
          <p className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft ${expanded ? '' : 'md:sr-only lg:not-sr-only'}`}>Menu</p>
          {NAV_ITEMS.map((item) => renderItem(item, 'side'))}
        </nav>
        <div className={`mt-auto border-t border-line px-6 py-4 ${expanded ? 'block' : 'hidden'} lg:block`}>
          <p className="font-serif text-sm font-semibold text-brand-navy">Leyte Normal University</p>
          <p className="text-xs text-ink-soft">Tacloban City</p>
        </div>
      </aside>

      <nav aria-label="Staff navigation" className="sticky top-16 z-30 flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 md:hidden">
        {NAV_ITEMS.map((item) => renderItem(item, 'bar'))}
      </nav>

      <main className="md:pl-20 lg:pl-64">
        <Outlet />
      </main>
    </div>;
}