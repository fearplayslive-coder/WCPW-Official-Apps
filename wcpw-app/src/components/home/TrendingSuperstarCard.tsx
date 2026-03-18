import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  MessageSquareText,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { apiUrl } from "../../lib/api";

type TrendingItemApi = {
  authorId: string;
  promos: number;
  mentions: number;
  momentum: number;
  score: number;
  reasons: string[];
  name?: string;
  username?: string;
  avatar?: string;
};

type TrendingResponseApiOk = {
  ok: true;
  windowDays: number;
  scanned: number;
  results: TrendingItemApi[];
};

type TrendingResponseApiErr = {
  ok: false;
  error: string;
  detail?: string;
};

type TrendingResponse = TrendingResponseApiOk | TrendingResponseApiErr;

type RosterEntry = {
  id: string;
  name: string;
  nickname?: string;
  discordUserId?: string;
};

type SitePayload = {
  roster?: RosterEntry[];
};

function safeStr(v: unknown, fallback = "") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function momentumLabel(m: number) {
  if (m >= 90) return "PEAKING";
  if (m >= 75) return "HOT";
  if (m >= 60) return "RISING";
  if (m >= 45) return "BUILDING";
  return "COLD";
}

export default function TrendingSuperstarCard() {
  const navigate = useNavigate();

  const [data, setData] = useState<TrendingResponse | null>(null);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadTrending() {
      try {
        setLoading(true);
        setError(null);

        const [trendingRes, rosterRes] = await Promise.all([
          fetch(apiUrl("/api/trending?limit=5&windowDays=14&promosLimit=350"), {
            cache: "no-store",
          }),
          fetch(apiUrl("/data/site-data.json"), {
            cache: "no-store",
          }),
        ]);

        const trendingJson = (await trendingRes.json()) as TrendingResponse;
        const rosterJson = (await rosterRes.json()) as SitePayload;

        if (!alive) return;

        setData(trendingJson);
        setRoster(Array.isArray(rosterJson.roster) ? rosterJson.roster : []);

        if ((trendingJson as TrendingResponseApiErr)?.ok === false) {
          const err = trendingJson as TrendingResponseApiErr;
          setError(err.detail || err.error || "Trending unavailable");
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Trending unavailable");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadTrending();

    return () => {
      alive = false;
    };
  }, []);

  const wrestlerByDiscordId = useMemo(() => {
    const map = new Map<string, RosterEntry>();

    for (const wrestler of roster) {
      const discordId = safeStr(wrestler.discordUserId);
      if (discordId) {
        map.set(discordId, wrestler);
      }
    }

    return map;
  }, [roster]);

  const top = useMemo(() => {
    if (!data || (data as any).ok !== true) return null;
    return (data as TrendingResponseApiOk).results?.[0] ?? null;
  }, [data]);

  const mappedTop = useMemo(() => {
    if (!top) return null;

    const wrestler = wrestlerByDiscordId.get(safeStr(top.authorId));

    return {
      ...top,
      wrestlerId: wrestler?.id || null,
      displayName:
        wrestler?.name ||
        safeStr(top.name) ||
        (top.username ? `@${top.username}` : "Unknown Superstar"),
      nickname: wrestler?.nickname || "",
    };
  }, [top, wrestlerByDiscordId]);

  if (loading) {
    return (
      <button
        type="button"
        onClick={() => navigate("/promos")}
        className="mb-6 w-full rounded-sm border border-white/10 bg-black/55 p-4 text-left backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/70"
      >
        <div className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          Trending Superstar
        </div>

        <div className="flex items-center gap-3 py-2 text-white/75">
          <Loader2 className="h-5 w-5 animate-spin text-red-400" />
          <span>Loading trending data…</span>
        </div>
      </button>
    );
  }

  if (!mappedTop) {
    return (
      <button
        type="button"
        onClick={() => navigate("/promos")}
        className="mb-6 w-full rounded-sm border border-white/10 bg-black/55 p-4 text-left backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/70"
      >
        <div className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          Trending Superstar
        </div>

        <div className="font-display text-2xl font-bold tracking-wide text-white">
          No Trending Data Yet
        </div>

        <div className="mt-2 text-sm text-white/65">
          {error || "Waiting for live promo activity."}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (mappedTop.wrestlerId) {
          navigate(`/roster/${mappedTop.wrestlerId}`);
          return;
        }

        navigate("/promos");
      }}
      className="mb-6 w-full rounded-sm border border-white/10 bg-black/55 p-4 text-left backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/70"
    >
      <div className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
        Trending Superstar
      </div>

      <div className="font-display text-2xl font-bold tracking-wide text-white">
        {mappedTop.displayName}
      </div>

      {mappedTop.nickname ? (
        <div className="mt-1 text-sm text-white/45">{mappedTop.nickname}</div>
      ) : null}

      <div className="mt-2 text-sm text-white/65">
        Last 14 days • Promos {mappedTop.promos} • Mentions {mappedTop.mentions}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
            <Flame className="h-4 w-4 text-red-400" />
            Promos
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            {mappedTop.promos}
          </div>
        </div>

        <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
            <MessageSquareText className="h-4 w-4 text-red-400" />
            Mentions
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            {mappedTop.mentions}
          </div>
        </div>

        <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
            <TrendingUp className="h-4 w-4 text-red-400" />
            Momentum
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            {mappedTop.momentum} • {momentumLabel(mappedTop.momentum)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(mappedTop.reasons || []).slice(0, 3).map((reason) => (
          <span
            key={reason}
            className="inline-flex rounded-sm border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-red-400"
          >
            {reason}
          </span>
        ))}
      </div>
    </button>
  );
}