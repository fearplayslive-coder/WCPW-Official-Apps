export default function More() {
  return (
    <div className="min-h-screen bg-arena px-4 pb-28 pt-6 text-white">
      <div className="mb-5">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
          Extras
        </div>
        <h1 className="font-display text-3xl font-black tracking-tight">
          More
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Future home for polls, settings, schedule, awards, and extras.
        </p>
      </div>

      <div className="space-y-3">
        <div className="panel-dark p-4">
          <h2 className="font-display text-lg font-bold">Polls</h2>
          <p className="mt-1 text-sm text-white/60">
            Fan voting and interactive features.
          </p>
        </div>

        <div className="panel-dark p-4">
          <h2 className="font-display text-lg font-bold">Schedule</h2>
          <p className="mt-1 text-sm text-white/60">
            Warfare, Showdown, and PPV timing.
          </p>
        </div>

        <div className="panel-dark p-4">
          <h2 className="font-display text-lg font-bold">Settings</h2>
          <p className="mt-1 text-sm text-white/60">
            Theme, layout, and app preferences later.
          </p>
        </div>
      </div>
    </div>
  );
}