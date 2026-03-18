import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Crown,
  Flame,
  Loader2,
  Search,
} from "lucide-react";

type Alignment = "Face" | "Heel" | "Tweener" | "???";
type MobileTab = "bio" | "moves" | "achievements" | "rivalries";
type SortMode = "default" | "alphabet" | "hof-first" | "gms-first";

type RivalryLike = {
  id?: string;
  matchup?: string;
  status?: string;
  stars?: number;
  heat?: number;
  tagline?: string;
  finalResult?: string;
};

type TeamLike = {
  id?: string;
  name?: string;
  alignment?: string;
  brand?: string;
  tagFinisher?: string;
};

type MoveSet = {
  signatures?: string[];
  finishers?: string[];
};

type SiteRosterEntry = {
  id: string;
  name: string;
  nickname?: string;
  alignment?: Alignment;
  status?: string;
  brand?: string;
  hallOfFame?: {
    season?: number;
  };
  photo?: string;
  tile?: string;
  portrait?: string;
  preview?: string;
  bio?: string;
  achievements?: string[];
  moves?: MoveSet;
  rivalries?: RivalryLike[];
  teams?: TeamLike[];
  entryType?: "wrestler" | "authority";
  authorityRole?: string;
  route?: string;
};

type SitePayload = {
  roster?: SiteRosterEntry[];
};

const DATA_URL = "https://wcpw-network.vercel.app/data/site-data.json";
const SORT_KEY = "wcpw_app_superstars_sort_v1";
const PLACEHOLDER =
  "https://placehold.co/800x1000/0a0a0a/ffffff?text=WCPW";

const alignmentStyles: Record<Alignment, string> = {
  Face: "text-blue-300 border-blue-400/40 bg-blue-400/10",
  Heel: "text-red-300 border-red-400/40 bg-red-400/10",
  Tweener: "text-purple-300 border-purple-400/40 bg-purple-400/10",
  "???": "text-zinc-300 border-zinc-400/30 bg-zinc-400/10",
};

const statusStyles: Record<string, string> = {
  Active: "text-emerald-200 border-emerald-400/30 bg-emerald-400/10",
  Inactive: "text-zinc-200 border-zinc-400/30 bg-zinc-400/10",
  Injured: "text-amber-200 border-amber-400/30 bg-amber-400/10",
  Suspended: "text-red-200 border-red-400/30 bg-red-400/10",
  Retired: "text-zinc-200 border-zinc-400/30 bg-zinc-400/10",
};

const sortModeLabels: Record<SortMode, string> = {
  default: "Default",
  alphabet: "Alphabet",
  "hof-first": "HOF 1st",
  "gms-first": "GMs First",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function safeStr(v: unknown, fallback = "—") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function normalizeEntry(raw: any): SiteRosterEntry | null {
  if (!raw || typeof raw !== "object") return null;

  const id = safeStr(raw.id, "");
  const name = safeStr(raw.name, "");
  if (!id || !name) return null;

  return {
    id,
    name,
    nickname: safeStr(raw.nickname, ""),
    alignment: (safeStr(raw.alignment, "???") as Alignment) || "???",
    status: safeStr(raw.status, "Active"),
    brand: safeStr(raw.brand, "WCPW"),
    hallOfFame:
      raw.hallOfFame && typeof raw.hallOfFame === "object"
        ? { season: Number(raw.hallOfFame.season) || undefined }
        : undefined,
    photo: safeStr(raw.photo, ""),
    tile: safeStr(raw.tile, ""),
    portrait: safeStr(raw.portrait, ""),
    preview: safeStr(raw.preview, ""),
    bio: safeStr(raw.bio, "Coming Soon…"),
    achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
    moves:
      raw.moves && typeof raw.moves === "object"
        ? {
            signatures: Array.isArray(raw.moves.signatures)
              ? raw.moves.signatures
              : [],
            finishers: Array.isArray(raw.moves.finishers)
              ? raw.moves.finishers
              : [],
          }
        : { signatures: [], finishers: [] },
    rivalries: Array.isArray(raw.rivalries) ? raw.rivalries : [],
    teams: Array.isArray(raw.teams) ? raw.teams : [],
    entryType: raw.entryType === "authority" ? "authority" : "wrestler",
    authorityRole: safeStr(raw.authorityRole, ""),
    route: `/roster/${id}`,
  };
}

function getRosterFromPayload(payload: SitePayload): SiteRosterEntry[] {
  const source = Array.isArray(payload.roster) ? payload.roster : [];
  return source
    .map(normalizeEntry)
    .filter((x): x is SiteRosterEntry => !!x);
}

function sortRosterEntries(entries: SiteRosterEntry[], mode: SortMode) {
  const arr = [...entries];

  if (mode === "alphabet") {
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (mode === "hof-first") {
    return arr.sort((a, b) => {
      const aHof = Number(!!a.hallOfFame?.season);
      const bHof = Number(!!b.hallOfFame?.season);
      if (aHof !== bHof) return bHof - aHof;
      return a.name.localeCompare(b.name);
    });
  }

  if (mode === "gms-first") {
    return arr.sort((a, b) => {
      const aAuth = Number(a.entryType === "authority");
      const bAuth = Number(b.entryType === "authority");
      if (aAuth !== bAuth) return bAuth - aAuth;
      return a.name.localeCompare(b.name);
    });
  }

  return arr;
}

function pickTileImage(w?: SiteRosterEntry) {
  if (!w) return PLACEHOLDER;
  return w.tile || w.photo || w.preview || w.portrait || PLACEHOLDER;
}

function pickPreviewImage(w?: SiteRosterEntry) {
  if (!w) return PLACEHOLDER;
  return w.preview || w.photo || w.tile || w.portrait || PLACEHOLDER;
}

function MobileTabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-sm border px-3 py-2 text-xs font-semibold transition whitespace-nowrap",
        active
          ? "border-red-500 bg-red-500/15 text-red-400"
          : "border-white/10 bg-black/25 text-white/75 hover:border-white/20 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 font-display text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}

export default function Superstars() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [roster, setRoster] = useState<SiteRosterEntry[]>([]);
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("bio");

  const [sortMode, setSortMode] = useState<SortMode>(() => {
    try {
      const raw = localStorage.getItem(SORT_KEY) as SortMode | null;
      if (
        raw === "default" ||
        raw === "alphabet" ||
        raw === "hof-first" ||
        raw === "gms-first"
      ) {
        return raw;
      }
      return "default";
    } catch {
      return "default";
    }
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch(DATA_URL, { cache: "no-store" });
        const json = (await res.json()) as SitePayload;

        if (!alive) return;

        setRoster(getRosterFromPayload(json));
      } catch (e: any) {
        if (!alive) return;
        setLoadError(e?.message || "Failed to load site roster data");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const filteredRoster = useMemo(() => {
    const sorted = sortRosterEntries(roster, sortMode);

    const q = search.trim().toLowerCase();
    if (!q) return sorted;

    return sorted.filter((entry) => {
      const haystack = [
        entry.name,
        entry.nickname,
        entry.brand,
        entry.status,
        entry.alignment,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [roster, sortMode, search]);

  const current = filteredRoster[selected] ?? filteredRoster[0];

  useEffect(() => {
    setSelected(0);
  }, [search, sortMode]);

  const desiredPreview = pickPreviewImage(current);
  const nickname = safeStr(current?.nickname, "");
  const alignment = (current?.alignment ?? "???") as Alignment;
  const status = safeStr(current?.status, "Active");
  const bio = safeStr(current?.bio, "Coming Soon…");
  const achievements = Array.isArray(current?.achievements)
    ? current.achievements
    : [];
  const rivalries = Array.isArray(current?.rivalries) ? current.rivalries : [];
  const signatures = Array.isArray(current?.moves?.signatures)
    ? current.moves?.signatures ?? []
    : [];
  const finishers = Array.isArray(current?.moves?.finishers)
    ? current.moves?.finishers ?? []
    : [];

  if (loading) {
    return (
      <div className="rounded-sm border border-white/10 bg-black/25 p-6 text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-red-400" />
          <span>Loading roster from website data…</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        Failed to load roster: {loadError}
      </div>
    );
  }

  if (!filteredRoster.length || !current) {
    return (
      <div className="rounded-sm border border-white/10 bg-black/25 p-6 text-white/70">
        No superstars found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${desiredPreview})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(16px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/95" />

      <div className="relative z-10 px-4 pt-4 pb-28">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Menu
          </button>

          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Superstar Select
          </div>
        </div>

        <div className="mb-3 rounded-sm border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Search Wrestlers
          </div>

          <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/30 px-3 py-2">
            <Search className="h-4 w-4 text-white/45" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any wrestler..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>
        </div>

        <div className="mb-4 rounded-sm border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Full Roster Filter
          </div>

          <div className="mb-3 text-sm text-white/75">
            Current: {sortModeLabels[sortMode]}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["default", "alphabet", "hof-first", "gms-first"] as SortMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setSortMode(mode);
                  localStorage.setItem(SORT_KEY, mode);
                }}
                className={cn(
                  "px-3 py-2 text-xs font-semibold rounded-sm border transition",
                  sortMode === mode
                    ? "border-red-500 bg-red-500/15 text-red-400"
                    : "border-white/10 bg-black/25 text-white/75 hover:border-white/20 hover:text-white"
                )}
              >
                {sortModeLabels[mode]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-sm border border-white/10 bg-white/5">
          <div className="relative">
            <img
              src={desiredPreview}
              alt={current.name}
              className="h-[260px] w-full object-cover"
              onError={(ev) => {
                const imgEl = ev.currentTarget as HTMLImageElement;
                if (imgEl.src !== PLACEHOLDER) imgEl.src = PLACEHOLDER;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="font-display text-3xl font-bold leading-none">
                {current.name}
              </h1>

              {nickname !== "—" && nickname ? (
                <div className="mt-1 text-sm text-zinc-300">{nickname}</div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "text-xs px-3 py-1 rounded-sm border",
                    alignmentStyles[alignment]
                  )}
                >
                  {alignment}
                </span>

                <span
                  className={cn(
                    "text-xs px-3 py-1 rounded-sm border",
                    statusStyles[status] ||
                      "text-zinc-200 border-zinc-400/30 bg-zinc-400/10"
                  )}
                >
                  {status}
                </span>

                {current?.hallOfFame?.season ? (
                  <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-sm border border-amber-300/25 bg-amber-300/10 text-amber-200">
                    <Crown className="h-4 w-4 text-amber-200" />
                    S{current.hallOfFame.season} Hall Of Famer
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/roster/${current.id}`)}
                  className="px-4 py-3 border rounded-sm transition-all font-bold text-sm border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  View More
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelected((prev) =>
                      Math.min(prev + 1, filteredRoster.length - 1)
                    )
                  }
                  className="px-4 py-3 border rounded-sm transition-all font-bold text-sm border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                >
                  Next Superstar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <MobileTabButton
            active={mobileTab === "bio"}
            onClick={() => setMobileTab("bio")}
          >
            Bio
          </MobileTabButton>
          <MobileTabButton
            active={mobileTab === "moves"}
            onClick={() => setMobileTab("moves")}
          >
            Moves
          </MobileTabButton>
          <MobileTabButton
            active={mobileTab === "achievements"}
            onClick={() => setMobileTab("achievements")}
          >
            Achievements
          </MobileTabButton>
          <MobileTabButton
            active={mobileTab === "rivalries"}
            onClick={() => setMobileTab("rivalries")}
          >
            Rivalries
          </MobileTabButton>
        </div>

        {mobileTab === "bio" ? (
          <Panel title="Character Info">
            <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          </Panel>
        ) : null}

        {mobileTab === "moves" ? (
          <Panel title="Moves">
            <div className="grid gap-3">
              <div className="rounded-sm border border-white/10 bg-black/30 p-4">
                <div className="text-xs tracking-widest text-white/60">
                  FINISHERS
                </div>
                <div className="mt-2 space-y-1 text-sm text-white/85">
                  {finishers.length ? (
                    finishers.map((move, idx) => <div key={`${move}-${idx}`}>{move}</div>)
                  ) : (
                    <div>—</div>
                  )}
                </div>
              </div>

              <div className="rounded-sm border border-white/10 bg-black/30 p-4">
                <div className="text-xs tracking-widest text-white/60">
                  SIGNATURES
                </div>
                <div className="mt-2 space-y-1 text-sm text-white/85">
                  {signatures.length ? (
                    signatures.map((move, idx) => <div key={`${move}-${idx}`}>{move}</div>)
                  ) : (
                    <div>—</div>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        ) : null}

        {mobileTab === "achievements" ? (
          <Panel title="Achievements">
            {achievements.length ? (
              <ul className="space-y-2 text-zinc-300">
                {achievements.map((a, idx) => (
                  <li key={`${a}-${idx}`} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-300">—</p>
            )}
          </Panel>
        ) : null}

        {mobileTab === "rivalries" ? (
          <Panel title="Current Rivalries">
            <div className="grid gap-2">
              {rivalries.length === 0 ? (
                <div className="rounded-sm border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
                  No rivalries listed for this wrestler yet.
                </div>
              ) : (
                rivalries.slice(0, 3).map((r, idx) => (
                  <div
                    key={r.id || `${current.id}-${idx}`}
                    className="rounded-sm border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Flame className="h-4 w-4 text-red-400 shrink-0" />
                      <span className="truncate font-semibold">
                        {safeStr(r.matchup, "Rivalry")}
                      </span>
                    </div>

                    {r.tagline ? (
                      <div className="text-xs text-white/55 italic mt-1">
                        {r.tagline}
                      </div>
                    ) : null}

                    <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
                      <span>⭐ {Number(r.stars) || 0}</span>
                      <span>🔥 {Number(r.heat) || 0}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        ) : null}

        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Full Roster
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {filteredRoster.map((w, i) => {
              const active = i === selected;
              const tileImg = pickTileImage(w);

              return (
                <button
                  key={w.id}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "overflow-hidden border bg-white/5 transition rounded-sm",
                    active
                      ? "border-red-500 ring-2 ring-red-500/60"
                      : "border-white/10 hover:border-white/20"
                  )}
                  aria-label={w.name}
                  title={w.name}
                >
                  <div className="relative aspect-square">
                    <img
                      src={tileImg}
                      alt={w.name}
                      className="h-full w-full object-cover opacity-90"
                      loading="lazy"
                      onError={(ev) => {
                        const imgEl = ev.currentTarget as HTMLImageElement;
                        if (imgEl.src !== PLACEHOLDER) imgEl.src = PLACEHOLDER;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>

                  <div className="bg-black/70 px-1 py-1 text-[10px] truncate">
                    {w.name}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-zinc-400">
            Tap a wrestler to switch selection • Search updates live
          </p>
        </div>
      </div>
    </div>
  );
}