import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Flame,
  Loader2,
  MessageSquareText,
  Search,
} from "lucide-react";

const API_BASE = "https://wcpw-network.vercel.app";

function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

type PromoAuthor = {
  id?: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  wrestlerId?: string | null;
};

type PromoMention = {
  id?: string;
  username?: string;
  displayName?: string;
  wrestlerId?: string | null;
};

type PromoItem = {
  id?: string;
  text?: string;
  createdAt?: string;
  createdMs?: number;
  jumpUrl?: string;
  author?: PromoAuthor;
  mentions?: PromoMention[];
  replyTo?: unknown;
};

type PromosApiOk = {
  ok: true;
  count?: number;
  promos: PromoItem[];
  meta?: {
    partial?: boolean;
    rateLimited?: boolean;
    retryAfterMs?: number;
    limit?: number;
    pagesFetched?: number;
    messagesFetched?: number;
  };
};

type PromosApiErr = {
  ok: false;
  error: string;
  detail?: string;
};

type PromosResponse = PromosApiOk | PromosApiErr;

type RosterEntry = {
  id: string;
  name: string;
  nickname?: string;
  discordUserId?: string;
};

type SitePayload = {
  roster?: RosterEntry[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function safeStr(v: unknown, fallback = "") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function isRecentPromo(promo: PromoItem) {
  const ms =
    typeof promo.createdMs === "number"
      ? promo.createdMs
      : new Date(promo.createdAt || "").getTime();

  if (!Number.isFinite(ms)) return false;

  const threeDays = 3 * 24 * 60 * 60 * 1000;
  return Date.now() - ms <= threeDays;
}

function getMentionCount(promo: PromoItem) {
  return Array.isArray(promo.mentions) ? promo.mentions.length : 0;
}

function extractPreview(text: string, max = 420) {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

function PromoBadge({
  children,
  danger = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-3 py-1 text-[11px] uppercase tracking-[0.18em]",
        danger
          ? "border-red-500/25 bg-red-500/10 text-red-400"
          : "border-white/10 bg-white/5 text-white/70"
      )}
    >
      {children}
    </span>
  );
}

export default function Promos() {
  const navigate = useNavigate();

  const [data, setData] = useState<PromosResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedPromoId, setExpandedPromoId] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterEntry[]>([]);

  useEffect(() => {
    let alive = true;

    async function loadAll() {
      try {
        setError(null);

        const [promosRes, rosterRes] = await Promise.all([
          fetch(apiUrl("/api/promos?limit=100"), { cache: "no-store" }),
          fetch(apiUrl("/data/site-data.json"), { cache: "no-store" }),
        ]);

        const promosJson = (await promosRes.json()) as PromosResponse;
        const rosterJson = (await rosterRes.json()) as SitePayload;

        if (!alive) return;

        setData(promosJson);
        setRoster(Array.isArray(rosterJson.roster) ? rosterJson.roster : []);

        if ((promosJson as PromosApiErr)?.ok === false) {
          const err = promosJson as PromosApiErr;
          setError(err.detail || err.error || "Promos unavailable");
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Promos unavailable");
      }
    }

    loadAll();

    return () => {
      alive = false;
    };
  }, []);

  const wrestlerByDiscordId = useMemo(() => {
    const map = new Map<string, RosterEntry>();

    for (const wrestler of roster) {
      const discordId = safeStr(wrestler.discordUserId);
      if (discordId) map.set(discordId, wrestler);
    }

    return map;
  }, [roster]);

  const promos = useMemo(() => {
    if (!data || (data as any).ok !== true) return [];
    return (data as PromosApiOk).promos || [];
  }, [data]);

  const filteredPromos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return promos;

    return promos.filter((promo) => {
      const mappedAuthor =
        wrestlerByDiscordId.get(safeStr(promo.author?.id))?.name || "";

      const mappedMentions = (promo.mentions || []).map(
        (m) => wrestlerByDiscordId.get(safeStr(m.id))?.name || ""
      );

      const haystack = [
        mappedAuthor,
        safeStr(promo.author?.displayName),
        safeStr(promo.author?.username),
        safeStr(promo.text),
        ...(promo.mentions || []).map((m) =>
          safeStr(m.displayName || m.username)
        ),
        ...mappedMentions,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [promos, search, wrestlerByDiscordId]);

  return (
    <main className="min-h-screen bg-black text-white px-4 pt-4 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Menu
          </button>

          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Live Promos
          </div>
        </div>

        <div className="mb-4 rounded-sm border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-white/45">
            Search Promos
          </div>

          <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/30 px-3 py-2">
            <Search className="h-4 w-4 text-white/45" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by wrestler, content, or mentions..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-sm border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        ) : null}

        {!data ? (
          <div className="rounded-sm border border-white/10 bg-black/25 p-6 text-white">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-red-400" />
              <span>Loading promos…</span>
            </div>
          </div>
        ) : null}

        {data && filteredPromos.length === 0 ? (
          <div className="rounded-sm border border-white/10 bg-black/25 p-6 text-white/70">
            No promos found.
          </div>
        ) : null}

        <div className="space-y-4">
          {filteredPromos.map((promo, index) => {
            const mappedAuthor = wrestlerByDiscordId.get(safeStr(promo.author?.id));

            const authorName =
              mappedAuthor?.name ||
              safeStr(promo.author?.displayName) ||
              safeStr(promo.author?.username) ||
              "Unknown Superstar";

            const mentionCount = getMentionCount(promo);
            const recent = isRecentPromo(promo);
            const promoText = safeStr(promo.text, "No promo text available.");
            const promoKey = promo.id || `promo-${index}`;
            const isExpanded = expandedPromoId === promoKey;

            return (
              <article
                key={promoKey}
                className="rounded-sm border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Promo
                    </div>

                    <h2 className="mt-1 font-display text-2xl font-bold text-white">
                      {authorName}
                    </h2>

                    <div className="mt-1 text-xs text-white/45">
                      {formatDate(promo.createdAt)}
                    </div>
                  </div>

                  {promo.jumpUrl ? (
                    <a
                      href={promo.jumpUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                    >
                      Open
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <PromoBadge danger>
                    <span className="inline-flex items-center gap-2">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Active Promo
                    </span>
                  </PromoBadge>

                  <PromoBadge>Callouts {mentionCount}</PromoBadge>

                  {recent ? (
                    <PromoBadge danger>
                      <span className="inline-flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5" />
                        Recent
                      </span>
                    </PromoBadge>
                  ) : null}
                </div>

                <div className="rounded-sm border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/85 whitespace-pre-line">
                  {isExpanded ? promoText : extractPreview(promoText)}
                </div>

                {promoText.length > 420 ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPromoId((prev) =>
                          prev === promoKey ? null : promoKey
                        )
                      }
                      className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/75 hover:bg-white/10"
                    >
                      {isExpanded ? "Show Less" : "Read Full Promo"}
                    </button>
                  </div>
                ) : null}

                {Array.isArray(promo.mentions) && promo.mentions.length > 0 ? (
                  <div className="mt-3">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                      Mentioned Superstars
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {promo.mentions.map((mention, idx) => {
                        const mappedMention = wrestlerByDiscordId.get(
                          safeStr(mention.id)
                        );

                        const mentionName =
                          mappedMention?.name ||
                          safeStr(mention.displayName) ||
                          safeStr(mention.username) ||
                          "Unknown";

                        return (
                          <span
                            key={`${mention.id || mention.username || idx}`}
                            className="rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                          >
                            {mentionName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}