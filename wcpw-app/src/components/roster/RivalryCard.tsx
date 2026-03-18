import type { Rivalry } from "../../data/rivalriesData";
import { Flame } from "lucide-react";
import { getRivalryDisplay } from "../../data/rivalriesData";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function RivalryCard({
  rivalry,
  compact = false,
}: {
  rivalry: Rivalry;
  compact?: boolean;
}) {
  const display = getRivalryDisplay(rivalry);
  const heat = Number(rivalry.heat) || 0;
  const stars = Number(rivalry.stars) || 0;

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-sm border border-white/10 bg-black/30 text-white/85",
        compact ? "px-4 py-3" : "p-4"
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <Flame className="h-4 w-4 shrink-0 text-red-400" />
            <span className="min-w-0 break-words font-semibold leading-tight">
              {display}
            </span>
          </div>

          {rivalry.tagline ? (
            <div className="mt-1 break-words text-xs italic text-white/55">
              {rivalry.tagline}
            </div>
          ) : null}
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-white/60">
          <span>⭐ {stars}</span>
          <span>🔥 {heat}%</span>
        </div>
      </div>

      {!compact && rivalry.summary ? (
        <div className="mt-3 break-words text-sm leading-relaxed text-white/70">
          {rivalry.summary}
        </div>
      ) : null}

      {!compact && Array.isArray(rivalry.keyMoments) && rivalry.keyMoments.length > 0 ? (
        <div className="mt-3">
          <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
            Key Moments
          </div>

          <div className="flex flex-col gap-2">
            {rivalry.keyMoments.slice(0, 3).map((moment) => (
              <div
                key={moment}
                className="w-full min-w-0 break-words rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
              >
                {moment}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!compact && rivalry.finalResult ? (
        <div className="mt-3 w-full min-w-0 break-words rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
          <span className="text-white/45">Final Result:</span> {rivalry.finalResult}
        </div>
      ) : null}
    </div>
  );
}