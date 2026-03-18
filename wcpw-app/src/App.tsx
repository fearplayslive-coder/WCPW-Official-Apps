import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import BottomNav from "./components/navigation/BottomNav";

import Home from "./pages/Home";
import Promos from "./pages/Promos";
import Network from "./pages/Network";
import More from "./pages/More";

import RosterHub from "./pages/roster/RosterHub";
import Superstars from "./pages/roster/Superstars";
import TagTeams from "./pages/roster/TagTeams";
import Rivalries from "./pages/roster/Rivalries";
import Trademarks from "./pages/roster/Trademarks";
import Titles from "./pages/roster/Titles";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/network" element={<Network />} />
          <Route path="/more" element={<More />} />

          <Route path="/roster" element={<RosterHub />}>
            <Route index element={<Navigate to="superstars" replace />} />
            <Route path="superstars" element={<Superstars />} />
            <Route path="tag-teams" element={<TagTeams />} />
            <Route path="rivalries" element={<Rivalries />} />
            <Route path="trademarks" element={<Trademarks />} />
            <Route path="titles" element={<Titles />} />
          </Route>
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}