"use client";

import { ExternalLink, Monitor, RefreshCw } from "lucide-react";
import { useId, useState } from "react";

export function BingoWorkspace() {
  const [consoleVersion, setConsoleVersion] = useState(0);
  const dashboardNoteId = useId();
  const linkClassName =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-[#cbd3cf] bg-white px-3 py-2 text-sm font-black text-ink transition hover:border-moss hover:text-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss";

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-[#d9dedb] bg-white p-4 shadow-panel" aria-labelledby="bingo-workspace-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="bingo-workspace-heading" className="text-xl font-black text-ink">OPE Bingo</h2>
            <p className="mt-1 text-sm text-muted">Run Bingo from your marketing roadmap.</p>
          </div>
          <span className="rounded-full bg-[#edf8ed] px-3 py-1 text-xs font-black text-moss">Host Console</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://www.opebingo.com/host"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-moss bg-moss px-3 py-2 text-sm font-black text-white transition hover:bg-[#0d4d2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Open Host Console
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href="https://www.opebingo.com/display" target="_blank" rel="noopener noreferrer" className={linkClassName}>
            <Monitor size={16} aria-hidden="true" />
            TV Display
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href="https://www.opebingo.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            aria-describedby={dashboardNoteId}
          >
            <ExternalLink size={16} aria-hidden="true" />
            Bingo Dashboard
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <p className="mt-2 text-xs text-muted">These links open in a new tab. Open TV Display on the screen used for your game.</p>
        <p id={dashboardNoteId} className="mt-3 rounded-lg bg-sand px-3 py-2 text-xs text-muted">
          Game management is currently unavailable on Ope Bingo. The host console remains available.
        </p>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#d9dedb] bg-white shadow-panel" aria-label="OPE Bingo host console">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d9dedb] px-4 py-3">
          <h3 className="text-sm font-black text-ink">Host Console</h3>
          <button
            type="button"
            className={linkClassName}
            onClick={() => setConsoleVersion((version) => version + 1)}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Reload console
          </button>
        </div>
        <iframe
          key={consoleVersion}
          src="https://www.opebingo.com/host"
          title="OPE Bingo host console"
          className="block h-[75vh] min-h-[600px] w-full border-0 bg-sand"
          allowFullScreen
        />
      </section>
    </div>
  );
}
