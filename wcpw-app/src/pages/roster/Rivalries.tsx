import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, Loader2, Search, Swords } from "lucide-react";
import type { Rivalry, RivalrySortMode } from "../../data/rivalriesData";
import {
  fetchRivalries,
  getRivalryDisplay,
  sortRivalries,
} from "../../data/rivalriesData";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const SORT_LABELS: Record<RivalrySortMode, string> = {
  heat: "Heat",
  stars: "Stars",
  name: "Name",
};

type StatusFilter = "all" | "Current" | "Past";

export default function RivalriesPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<RivalrySortMode>("heat");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setLoadError(null);

        const data = await fetchRivalries();
        if (!alive) return;

        setRivalries(data);
      } catch (e: any) {
        if (!alive) return;
        setLoadError(e?.message || "Failed to load rivalries");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const filteredRivalries = useMemo(() => {
    let list = [...rivalries];

    if (statusFilter !== "all") {
      list = list.filter((r) => (r.status || "") === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const haystack = [
          getRivalryDisplay(r),
          r.tagline || "",
          r.summary || "",
          r.finalResult || "",
          r.tone || "",
          ...(r.keyMoments || []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
    }

    return sortRivalries(list, sortMode);
  }, [rivalries, search, statusFilter, sortMode]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.14),transparent_45%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl overflow-x-hidden px-4 pb-28 pt-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-[11px] uppercase tracking-[0.28em] text-white/55">
            Rivalries
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-sm border border-white/10 bg-white/5 p-2">
            <Swords className="h-6 w-6 text-red-400" />
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-4xl font-bold tracking-wide sm:text-5xl">
              Rivalries
            </h1>
            <p className="mt-2 text-zinc-300">
              Feuds, heat, history, and the wars that shaped WCPW.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-[1.4fr_auto_auto]">
          <div className="rounded-sm border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
              Search Rivalries
            </div>

            <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/30 px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-white/45" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search matchups, taglines, summary..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <div className="rounded-sm border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
              Status
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "Current", "Past"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-sm border px-3 py-2 text-xs font-semibold transition",
                    statusFilter === status
                      ? "border-red-500 bg-red-500/15 text-red-400"
                      : "border-white/10 bg-black/25 text-white/75 hover:border-white/20 hover:text-white"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
              Sort By
            </div>

            <div className="flex flex-wrap gap-2">
              {(["heat", "stars", "name"] as RivalrySortMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSortMode(mode)}
                  className={cn(
                    "rounded-sm border px-3 py-2 text-xs font-semibold transition",
                    sortMode === mode
                      ? "border-red-500 bg-red-500/15 text-red-400"
                      : "border-white/10 bg-black/25 text-white/75 hover:border-white/20 hover:text-white"
                  )}
                >
                  {SORT_LABELS[mode]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-sm border border-white/10 bg-black/25 p-6 text-white">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-red-400" />
              <span>Loading rivalries…</span>
            </div>
          </div>
        ) : null}

        {loadError ? (
          <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {loadError}
          </div>
        ) : null}

        {!loading && !loadError ? (
          <>
            <div className="mb-4 text-sm text-white/55">
              Showing {filteredRivalries.length} rivalr
              {filteredRivalries.length === 1 ? "y" : "ies"}
            </div>

            {filteredRivalries.length === 0 ? (
              <div className="rounded-sm border border-white/10 bg-black/25 p-6 text-white/70">
                No rivalries found.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredRivalries.map((rivalry) => (
                  <div
                    key={rivalry.id}
                    className="w-full min-w-0 overflow-hidden rounded-sm border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <Flame className="h-4 w-4 shrink-0 text-red-400" />
                          <div className="min-w-0 break-words font-display text-lg font-bold leading-tight tracking-wide sm:text-xl">
                            {getRivalryDisplay(rivalry)}
                          </div>
                        </div>

                        {rivalry.tagline ? (
                          <div className="mt-1 break-words text-xs italic text-white/55">
                            {rivalry.tagline}
                          </div>
                        ) : null}
                      </div>

                      <div className="shrink-0 rounded-sm border border-red-500/25 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-red-300">
                        {rivalry.status || "Unknown"}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-white/60">
                      <span>⭐ {Number(rivalry.stars) || 0}</span>
                      <span>🔥 {Number(rivalry.heat) || 0}%</span>
                      {rivalry.tone ? (
                        <span className="break-words">{rivalry.tone}</span>
                      ) : null}
                    </div>

                    {rivalry.summary ? (
                      <div className="mb-3 break-words text-sm leading-relaxed text-white/72">
                        {rivalry.summary}
                      </div>
                    ) : null}

                    {Array.isArray(rivalry.keyMoments) &&
                    rivalry.keyMoments.length > 0 ? (
                      <div className="mb-3">
                        <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                          Key Moments
                        </div>

                        <div className="flex flex-col gap-2">
                          {rivalry.keyMoments.slice(0, 3).map((moment) => (
                            <div
                              key={moment}
                              className="w-full min-w-0 break-words rounded-sm border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70"
                            >
                              {moment}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {rivalry.finalResult ? (
                      <div className="w-full min-w-0 break-words rounded-sm border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/75">
                        <span className="text-white/45">Final Result:</span>{" "}
                        {rivalry.finalResult}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}