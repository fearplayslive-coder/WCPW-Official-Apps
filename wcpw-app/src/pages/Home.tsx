import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ban,
  Flame,
  Loader2,
  MessageSquareText,
  Mic2,
  ScrollText,
  Swords,
  TrendingUp,
  Trophy,
  Tv2,
  Users2,
} from "lucide-react";
import heroImage from "../assets/hero-arena.jpg";
import logo from "../assets/wcpw-logo.png";

const TARGET_DATE = "2026-03-18T00:00:00-07:00";
const API_BASE = "https://wcpw-network.vercel.app";

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

function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

function getCountdown() {
  const target = new Date(TARGET_DATE).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return null;

  const total = Math.floor(diff / 1000);

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function momentumLabel(m: number) {
  if (m >= 90) return "PEAKING";
  if (m >= 75) return "HOT";
  if (m >= 60) return "RISING";
  if (m >= 45) return "BUILDING";
  return "COLD";
}

function safeStr(v: unknown, fallback = "") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function QuickCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm border border-white/10 bg-black/55 p-4 text-left backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/70"
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-red-500/30 bg-red-500/10 text-red-400">
        {icon}
      </div>

      <div className="font-display text-lg font-bold tracking-wide text-white">
        {title}
      </div>

      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
        {subtitle}
      </div>
    </button>
  );
}

function InfoCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-sm border border-white/10 bg-black/55 p-4 text-left backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/70"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-red-400">{icon}</span>
        <div className="text-[11px] uppercase tracking-[0.25em] text-white/55">
          {title}
        </div>
      </div>

      <div className="text-sm text-white/70">{text}</div>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(getCountdown());

  const [trendingData, setTrendingData] = useState<TrendingResponse | null>(null);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadTrending() {
      try {
        setTrendingLoading(true);
        setTrendingError(null);

        const res = await fetch(
          apiUrl("/api/trending?limit=5&windowDays=14&promosLimit=350"),
          { cache: "no-store" }
        );

        const json = (await res.json()) as TrendingResponse;

        if (!alive) return;

        setTrendingData(json);

        if ((json as TrendingResponseApiErr)?.ok === false) {
          const err = json as TrendingResponseApiErr;
          setTrendingError(err.detail || err.error || "Trending unavailable");
        }
      } catch (e: any) {
        if (!alive) return;
        setTrendingError(e?.message || "Trending unavailable");
      } finally {
        if (alive) setTrendingLoading(false);
      }
    }

    loadTrending();

    return () => {
      alive = false;
    };
  }, []);

  const topTrending = useMemo(() => {
    if (!trendingData || (trendingData as any).ok !== true) return null;
    const ok = trendingData as TrendingResponseApiOk;
    return ok.results?.[0] ?? null;
  }, [trendingData]);

  const trendingSubtitle = useMemo(() => {
    if (topTrending) {
      return `Promos ${topTrending.promos} • Mentions ${topTrending.mentions} • Momentum ${topTrending.momentum}`;
    }

    if (trendingError) return trendingError;

    return "Featured across roster, rivalries, promos, and title history.";
  }, [topTrending, trendingError]);

  const trendingMeta = useMemo(() => {
    if (!trendingData || (trendingData as any).ok !== true) return "";
    const ok = trendingData as TrendingResponseApiOk;
    return `Last ${ok.windowDays} days • scanned ${ok.scanned} promos`;
  }, [trendingData]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.18),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:100%_6px]" />

      <div className="relative z-10 mx-auto w-full max-w-md px-4 pb-28 pt-8">
        <div className="mb-6 flex flex-col items-start gap-4">
          <img
            src={logo}
            alt="WCPW Logo"
            className="w-44 drop-shadow-[0_0_20px_rgba(220,38,38,0.45)]"
          />

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-red-500/30 bg-red-500/15 p-3 shadow-[0_0_24px_rgba(220,38,38,0.35)]">
              <Flame className="h-6 w-6 text-red-400" />
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/55">
                West Coast Pro Wrestling
              </div>
            </div>
          </div>
        </div>

        <section className="mb-6">
          <h1 className="font-display text-4xl font-bold leading-none tracking-wide sm:text-5xl">
            West Coast
            <span className="block text-red-500">Pro Wrestling</span>
          </h1>

          <p className="mt-3 max-w-sm text-sm uppercase tracking-[0.18em] text-white/65">
            Where legends are forged and rivalries ignite
          </p>
        </section>

        {countdown ? (
          <section className="mb-6 rounded-sm border border-red-500/30 bg-black/60 p-4 backdrop-blur-md shadow-[0_0_30px_rgba(220,38,38,0.18)]">
            <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-red-400">
              Warfare Begins In
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-sm border border-red-500/20 bg-black/50 p-3 text-center">
                <div className="font-display text-2xl text-white">
                  {String(countdown.days).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Days
                </div>
              </div>

              <div className="rounded-sm border border-red-500/20 bg-black/50 p-3 text-center">
                <div className="font-display text-2xl text-white">
                  {String(countdown.hours).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Hours
                </div>
              </div>

              <div className="rounded-sm border border-red-500/20 bg-black/50 p-3 text-center">
                <div className="font-display text-2xl text-white">
                  {String(countdown.minutes).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Minutes
                </div>
              </div>

              <div className="rounded-sm border border-red-500/20 bg-black/50 p-3 text-center">
                <div className="font-display text-2xl text-white">
                  {String(countdown.seconds).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Seconds
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => navigate("/promos")}
          className="mb-6 w-full rounded-sm border border-white/10 bg-black/55 p-4 text-left backdrop-blur-md transition hover:border-red-500/40 hover:bg-black/70"
        >
          <div className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
            Trending Superstar
          </div>

          {trendingLoading ? (
            <div className="flex items-center gap-3 py-2 text-white/75">
              <Loader2 className="h-5 w-5 animate-spin text-red-400" />
              <span>Loading trending data…</span>
            </div>
          ) : (
            <>
              <div className="font-display text-2xl font-bold tracking-wide text-white">
                {safeStr(topTrending?.name, "No Trending Data Yet")}
              </div>

              {trendingMeta ? (
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  {trendingMeta}
                </div>
              ) : null}

              <div className="mt-2 text-sm text-white/65">{trendingSubtitle}</div>

              {topTrending ? (
                <>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55">
                        <Flame className="h-3.5 w-3.5 text-red-400" />
                        Promos
                      </div>
                      <div className="mt-1 text-lg font-bold text-white">
                        {topTrending.promos}
                      </div>
                    </div>

                    <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55">
                        <MessageSquareText className="h-3.5 w-3.5 text-red-400" />
                        Mentions
                      </div>
                      <div className="mt-1 text-lg font-bold text-white">
                        {topTrending.mentions}
                      </div>
                    </div>

                    <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55">
                        <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                        Momentum
                      </div>
                      <div className="mt-1 text-lg font-bold text-white">
                        {topTrending.momentum}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-sm border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-red-400">
                      {momentumLabel(topTrending.momentum)}
                    </span>

                    {(topTrending.reasons || []).slice(0, 3).map((reason) => (
                      <span
                        key={reason}
                        className="inline-flex rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4 inline-flex rounded-sm border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-red-400">
                  Main Event Energy
                </div>
              )}
            </>
          )}
        </button>

        <section className="grid grid-cols-2 gap-3">
          <QuickCard
            icon={<Trophy className="h-5 w-5" />}
            title="Titles"
            subtitle="Champions & History"
            onClick={() => navigate("/roster/titles")}
          />
          <QuickCard
            icon={<Swords className="h-5 w-5" />}
            title="Rivalries"
            subtitle="Feuds & Heat"
            onClick={() => navigate("/roster/rivalries")}
          />
          <QuickCard
            icon={<Mic2 className="h-5 w-5" />}
            title="Promos"
            subtitle="Segments & Talk"
            onClick={() => navigate("/promos")}
          />
          <QuickCard
            icon={<Tv2 className="h-5 w-5" />}
            title="Network"
            subtitle="Reruns & Streams"
            onClick={() => navigate("/network")}
          />
        </section>

        <section className="mt-6 space-y-3">
          <InfoCard
            icon={<ScrollText className="h-4 w-4" />}
            title="Rules"
            text="Read the rules, roster expectations, and WCPW setup."
            onClick={() => navigate("/more")}
          />

          <InfoCard
            icon={<Ban className="h-4 w-4" />}
            title="Banned Moves"
            text="Stay updated with restricted moves and match safety rules."
            onClick={() => navigate("/more")}
          />

          <InfoCard
            icon={<Users2 className="h-4 w-4" />}
            title="Supporters"
            text="See the people supporting WCPW and helping the brand grow."
            onClick={() => navigate("/more")}
          />
        </section>
      </div>
    </main>
  );
}