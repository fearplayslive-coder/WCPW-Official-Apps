import { apiUrl } from "../lib/api";

export type RivalryMember = {
  id?: string;
  name?: string;
};

export type RivalrySide = {
  label?: string;
  members?: RivalryMember[];
};

export type RivalryBestMatch = {
  title?: string;
  event?: string;
  date?: string;
  stipulation?: string;
  winner?: string;
  stars?: number;
  notes?: string;
  rating?: number;
};

export type Rivalry = {
  id: string;
  type?: "1v1" | "2v2" | "triple" | string;
  status?: "Current" | "Past" | string;
  sides?: RivalrySide[];
  tagline?: string;
  stars?: number;
  heat?: number;
  tone?: string;
  start?: string;
  end?: string;
  summary?: string;
  keyMoments?: string[];
  bestMatches?: RivalryBestMatch[];
  finalResult?: string;
  matchup?: string;

  aName?: string;
  bName?: string;
  cName?: string;

  aId?: string;
  bId?: string;
  cId?: string;

  aMembers?: RivalryMember[];
  bMembers?: RivalryMember[];

  aTeamName?: string;
  bTeamName?: string;

  intensity?: string;
  memberIds?: string[];
};

type SitePayload = {
  rivalries?: Rivalry[];
};

function safeStr(v: unknown, fallback = "") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function safeNum(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeRivalry(raw: any): Rivalry | null {
  if (!raw || typeof raw !== "object") return null;

  const id = safeStr(raw.id);
  if (!id) return null;

  return {
    id,
    type: safeStr(raw.type),
    status: safeStr(raw.status),
    sides: Array.isArray(raw.sides) ? raw.sides : [],
    tagline: safeStr(raw.tagline),
    stars: safeNum(raw.stars),
    heat: safeNum(raw.heat),
    tone: safeStr(raw.tone),
    start: safeStr(raw.start),
    end: safeStr(raw.end),
    summary: safeStr(raw.summary),
    keyMoments: Array.isArray(raw.keyMoments) ? raw.keyMoments : [],
    bestMatches: Array.isArray(raw.bestMatches) ? raw.bestMatches : [],
    finalResult: safeStr(raw.finalResult),
    matchup: safeStr(raw.matchup),

    aName: safeStr(raw.aName),
    bName: safeStr(raw.bName),
    cName: safeStr(raw.cName),

    aId: safeStr(raw.aId),
    bId: safeStr(raw.bId),
    cId: safeStr(raw.cId),

    aMembers: Array.isArray(raw.aMembers) ? raw.aMembers : [],
    bMembers: Array.isArray(raw.bMembers) ? raw.bMembers : [],

    aTeamName: safeStr(raw.aTeamName),
    bTeamName: safeStr(raw.bTeamName),

    intensity: safeStr(raw.intensity),
    memberIds: Array.isArray(raw.memberIds) ? raw.memberIds : [],
  };
}

export async function fetchRivalries(): Promise<Rivalry[]> {
  const res = await fetch(apiUrl("/data/site-data.json"), {
    cache: "no-store",
  });

  const json = (await res.json()) as SitePayload;

  const source = Array.isArray(json.rivalries) ? json.rivalries : [];

  return source
    .map(normalizeRivalry)
    .filter((x): x is Rivalry => !!x);
}

export function getRivalryDisplay(r: Rivalry) {
  if (r.matchup) return r.matchup;
  if (r.type === "1v1") return `${r.aName || "A"} vs ${r.bName || "B"}`;
  if (r.type === "2v2") return `${r.aTeamName || "Team A"} vs ${r.bTeamName || "Team B"}`;
  if (r.type === "triple") {
    return `${r.aName || "A"} vs ${r.bName || "B"} vs ${r.cName || "C"}`;
  }
  return "Rivalry";
}

export function rivalryHasWrestler(r: Rivalry, wrestlerId: string) {
  const id = safeStr(wrestlerId);
  if (!id) return false;

  if (Array.isArray(r.memberIds) && r.memberIds.includes(id)) return true;
  if (r.aId === id || r.bId === id || r.cId === id) return true;

  if (Array.isArray(r.aMembers) && r.aMembers.some((m) => m.id === id)) return true;
  if (Array.isArray(r.bMembers) && r.bMembers.some((m) => m.id === id)) return true;

  if (Array.isArray(r.sides)) {
    for (const side of r.sides) {
      if (Array.isArray(side.members) && side.members.some((m) => m.id === id)) {
        return true;
      }
    }
  }

  return false;
}

export function getTopRivalriesForWrestler(
  rivalries: Rivalry[],
  wrestlerId: string,
  limit = 3
) {
  const all = rivalries
    .filter((r) => rivalryHasWrestler(r, wrestlerId))
    .sort((a, b) => (b.heat || 0) - (a.heat || 0));

  const current = all.filter((r) => safeStr(r.status) === "Current");
  if (current.length) return current.slice(0, limit);

  const past = all.filter((r) => safeStr(r.status) === "Past");
  if (past.length) return past.slice(0, limit);

  return all.slice(0, limit);
}

export type RivalrySortMode = "heat" | "stars" | "name";

export function sortRivalries(
  rivalries: Rivalry[],
  mode: RivalrySortMode
) {
  const arr = [...rivalries];

  if (mode === "name") {
    return arr.sort((a, b) =>
      getRivalryDisplay(a).localeCompare(getRivalryDisplay(b))
    );
  }

  if (mode === "stars") {
    return arr.sort((a, b) => (b.stars || 0) - (a.stars || 0));
  }

  return arr.sort((a, b) => (b.heat || 0) - (a.heat || 0));
}