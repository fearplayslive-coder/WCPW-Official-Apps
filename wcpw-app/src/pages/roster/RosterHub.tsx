import { NavLink, Outlet } from "react-router-dom";

function tabClass(isActive: boolean) {
  return [
    "whitespace-nowrap rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all",
    isActive
      ? "border-primary bg-primary/15 text-primary"
      : "border-white/10 bg-black/30 text-white/70 hover:border-white/20 hover:text-white",
  ].join(" ");
}

export default function RosterHub() {
  return (
    <div className="relative min-h-screen bg-arena px-4 pb-28 pt-6 text-white">
      <div className="mb-5">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
          WCPW Hub
        </div>
        <h1 className="font-display text-3xl font-black tracking-tight">
          Roster
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Mobile roster, teams, rivalries, trademarks, and titles.
        </p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <NavLink to="superstars" className={({ isActive }) => tabClass(isActive)}>
          Superstars
        </NavLink>
        <NavLink to="tag-teams" className={({ isActive }) => tabClass(isActive)}>
          Tag Teams
        </NavLink>
        <NavLink to="rivalries" className={({ isActive }) => tabClass(isActive)}>
          Rivalries
        </NavLink>
        <NavLink
          to="trademarks"
          className={({ isActive }) => tabClass(isActive)}
        >
          Trademarks
        </NavLink>
        <NavLink to="titles" className={({ isActive }) => tabClass(isActive)}>
          Titles
        </NavLink>
      </div>

      <div className="panel-dark p-4">
        <Outlet />
      </div>
    </div>
  );
}