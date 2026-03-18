import { Home, Menu, Mic2, Tv2, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

function navClass(isActive: boolean) {
  return [
    "flex flex-1 flex-col items-center justify-center gap-1 border-t-2 px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all",
    isActive
      ? "border-red-500 bg-red-500/10 text-red-400"
      : "border-transparent bg-black/90 text-white/60 hover:bg-black hover:text-white/85",
  ].join(" ");
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto grid h-20 w-full max-w-md grid-cols-5">
        <NavLink to="/" className={({ isActive }) => navClass(isActive)}>
          <Home className="h-4 w-4" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/roster/superstars"
          className={({ isActive }) => navClass(isActive)}
        >
          <Users className="h-4 w-4" />
          <span>Roster</span>
        </NavLink>

        <NavLink to="/promos" className={({ isActive }) => navClass(isActive)}>
          <Mic2 className="h-4 w-4" />
          <span>Promos</span>
        </NavLink>

        <NavLink
          to="/network"
          className={({ isActive }) => navClass(isActive)}
        >
          <Tv2 className="h-4 w-4" />
          <span>Network</span>
        </NavLink>

        <NavLink to="/more" className={({ isActive }) => navClass(isActive)}>
          <Menu className="h-4 w-4" />
          <span>More</span>
        </NavLink>
      </div>
    </nav>
  );
}