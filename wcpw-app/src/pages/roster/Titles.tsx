import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Crown,
  ShieldAlert,
  Trophy,
  X,
} from "lucide-react";
import {
  titleHistoryData,
  type TitleHistory,
  type TitleReign,
} from "../../data/titleHistoryData";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getLatestReign(history: TitleReign[] = []) {
  if (!Array.isArray(history) || history.length === 0) return null;
  return history[history.length - 1] ?? null;
}

function isVacantChampion(name?: string) {
  return (name || "").trim().toLowerCase() === "vacant";
}

function isCurrentChampion(reign: TitleReign | null) {
  if (!reign) return false;
  if (isVacantChampion(reign.champion)) return false;
  return !reign.end;
}

function currentStatusLabel(title: TitleHistory) {
  const latest = getLatestReign(title.history);

  if (!latest) return "No history";
  if (title.retired) return "Retired";
  if (isCurrentChampion(latest)) return "Active Champion";
  if (isVacantChampion(latest.champion)) return "Vacant";
  return latest.notes ? latest.notes : "Past Title State";
}

function getDisplayedChampion(title: TitleHistory) {
  const latest = getLatestReign(title.history);
  if (!latest) return "—";
  return latest.champion || "—";
}

function getReignCount(title: TitleHistory) {
  return Array.isArray(title.history) ? title.history.length : 0;
}

function getCardAccent(title: TitleHistory) {
  const latest = getLatestReign(title.history);

  if (title.retired) return "border-white/10";
  if (latest && isCurrentChampion(latest)) return "border-red-500/35";
  if (latest && isVacantChampion(latest.champion)) return "border-amber-400/30";

  return "border-white/10";
}

function getStatusChipClass(title: TitleHistory) {
  const latest = getLatestReign(title.history);

  if (title.retired) {
    return "border-white/10 bg-white/5 text-white/60";
  }

  if (latest && isCurrentChampion(latest)) {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (latest && isVacantChampion(latest.champion)) {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  }

  return "border-white/10 bg-white/5 text-white/70";
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="text-red-400">{icon}</div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
    </div>
  );
}

export default function Titles() {
  const [selected, setSelected] = useState<TitleHistory | null>(null);

  const titles = useMemo(() => {
    const arr = Array.isArray(titleHistoryData) ? titleHistoryData : [];

    return [...arr].sort((a, b) => {
      const aRetired = Number(!!a.retired);
      const bRetired = Number(!!b.retired);

      if (aRetired !== bRetired) return aRetired - bRetired;
      return a.name.localeCompare(b.name);
    });
  }, []);

  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black">Titles</h2>
          <p className="text-sm text-white/55">
            Championships, current holders, and legacy
          </p>
        </div>

        <span className="rounded-sm border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/65">
          {titles.length} listed
        </span>
      </div>

      <div className="space-y-3">
        {titles.map((title) => {
          const latest = getLatestReign(title.history);
          const displayedChampion = getDisplayedChampion(title);
          const reigns = getReignCount(title);

          return (
            <button
              key={title.id}
              type="button"
              onClick={() => setSelected(title)}
              className={cn(
                "w-full overflow-hidden rounded-sm border bg-black/35 text-left transition hover:bg-black/50",
                getCardAccent(title)
              )}
            >
              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Championship
                    </div>

                    <div className="mt-1 font-display text-xl font-bold tracking-wide text-white">
                      {title.name}
                    </div>

                    {title.shortName ? (
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-white/45">
                        {title.shortName}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      "shrink-0 rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                      getStatusChipClass(title)
                    )}
                  >
                    {currentStatusLabel(title)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-3">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Current / Latest
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {displayedChampion}
                    </div>
                  </div>

                  <div className="rounded-sm border border-white/10 bg-black/30 px-3 py-3">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Reigns
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {reigns}
                    </div>
                  </div>
                </div>

                {latest?.notes ? (
                  <div className="mt-3 rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                    Note: {latest.notes}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-white/45">
                  <span>Tap to open full history</span>
                  <ArrowRight className="h-4 w-4 text-white/40" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[80]">
          <button
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
            aria-label="Close title menu"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-[#090909] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur-xl">
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/55">
                Championship Menu
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-sm border border-white/10 bg-white/5 p-2 text-white/75 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 pb-8">
              <div className="overflow-hidden rounded-sm border border-white/10 bg-black/30">
                <div className="bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_55%)] p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-sm border border-red-500/25 bg-red-500/10 p-2">
                      <Trophy className="h-5 w-5 text-red-400" />
                    </div>

                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                        Title History
                      </div>
                      <h2 className="font-display text-2xl font-black leading-tight">
                        {selected.name}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "rounded-sm border px-3 py-1 text-xs",
                        getStatusChipClass(selected)
                      )}
                    >
                      {currentStatusLabel(selected)}
                    </span>

                    <span className="rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {getReignCount(selected)} reign
                      {getReignCount(selected) === 1 ? "" : "s"}
                    </span>

                    {selected.retired ? (
                      <span className="rounded-sm border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                        Retired
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-5">
                <section className="rounded-sm border border-white/10 bg-black/35 p-4">
                  <SectionTitle
                    icon={<Crown className="h-4 w-4" />}
                    title="Current / Latest Holder"
                  />

                  <div className="rounded-sm border border-white/10 bg-black/25 px-3 py-3">
                    <div className="text-sm font-semibold text-white">
                      {getDisplayedChampion(selected)}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">
                      {currentStatusLabel(selected)}
                    </div>
                  </div>
                </section>

                <section className="rounded-sm border border-white/10 bg-black/35 p-4">
                  <SectionTitle
                    icon={<ShieldAlert className="h-4 w-4" />}
                    title="Full Reign History"
                  />

                  <div className="space-y-3">
                    {[...(selected.history || [])]
                      .slice()
                      .reverse()
                      .map((reign, index) => {
                        const latest = index === 0;

                        return (
                          <div
                            key={`${selected.id}-${reign.champion}-${reign.start}-${index}`}
                            className={cn(
                              "rounded-sm border bg-black/25 px-3 py-3",
                              latest ? "border-red-500/30" : "border-white/10"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-white">
                                  {reign.champion}
                                </div>

                                <div className="mt-1 text-xs text-white/55">
                                  {reign.start}{" "}
                                  {reign.end ? `• ${reign.end}` : "• Present"}
                                </div>

                                {reign.notes ? (
                                  <div className="mt-2 text-xs text-red-300/85">
                                    {reign.notes}
                                  </div>
                                ) : null}
                              </div>

                              {latest ? (
                                <span className="rounded-sm border border-red-500/25 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-red-300">
                                  Latest
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>

                <section className="rounded-sm border border-white/10 bg-black/35 p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex-1 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white/80 transition hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}