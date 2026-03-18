export default function Network() {
  return (
    <div className="min-h-screen bg-arena px-4 pb-28 pt-6 text-white">
      <div className="mb-5">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
          Watch
        </div>
        <h1 className="font-display text-3xl font-black tracking-tight">
          Network
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Reruns, streams, highlights, and platform drops.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-200/80">
            YouTube
          </div>
          <div className="mt-2 font-display text-lg font-bold">
            Weekly Reruns
          </div>
          <div className="mt-1 text-sm text-white/65">
            Episodes, clips, and archive playlists.
          </div>
        </div>

        <div className="rounded-sm border border-purple-500/20 bg-purple-500/10 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200/80">
            Twitch
          </div>
          <div className="mt-2 font-display text-lg font-bold">Live Posts</div>
          <div className="mt-1 text-sm text-white/65">
            Streams, match drops, and community content.
          </div>
        </div>
      </div>
    </div>
  );
}