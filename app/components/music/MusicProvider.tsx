"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ──────────────────────────────────────────────────────────────────────
 * SoundCloud Widget API — minimal type surface we actually use.
 * Full reference: https://developers.soundcloud.com/docs/api/html5-widget
 * ────────────────────────────────────────────────────────────────────── */
type SCSound = {
  title: string;
  permalink_url?: string;
  artwork_url?: string | null;
  duration: number;
  user?: { username?: string };
};

type SCWidget = {
  bind: (event: string, listener: (data?: unknown) => void) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (ms: number) => void;
  getDuration: (cb: (ms: number) => void) => void;
  getPosition: (cb: (ms: number) => void) => void;
  getCurrentSound: (cb: (sound: SCSound | null) => void) => void;
};

type SCStatic = {
  Widget: ((iframe: HTMLIFrameElement) => SCWidget) & {
    Events: {
      READY: string;
      PLAY: string;
      PAUSE: string;
      FINISH: string;
      PLAY_PROGRESS: string;
    };
  };
};

declare global {
  interface Window {
    SC?: SCStatic;
  }
}

const WIDGET_SCRIPT = "https://w.soundcloud.com/player/api.js";
const PLAYLIST_URL =
  process.env.NEXT_PUBLIC_MUSIC_PLAYLIST_URL ||
  "https://soundcloud.com/chillhopdotcom/sets/chillhop-essentials-fall-2023";

/* ──────────────────────────────────────────────────────────────────────
 * Lazy script loader — single in-flight promise, cached after first call.
 * ────────────────────────────────────────────────────────────────────── */
let scriptPromise: Promise<void> | null = null;
function loadWidgetScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.SC?.Widget) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SCRIPT}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("sc")), {
        once: true,
      });
      return;
    }
    const s = document.createElement("script");
    s.src = WIDGET_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("sc"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/* ──────────────────────────────────────────────────────────────────────
 * Context shape
 * ────────────────────────────────────────────────────────────────────── */
type MusicState = {
  ready: boolean;
  loading: boolean;
  open: boolean;
  playing: boolean;
  position: number;
  duration: number;
  title: string;
  artist: string;
  artwork: string | null;
  permalink: string | null;
  /** Monotonic counter incremented on every user-initiated play/pause.
   *  Lets toast consumers fire on every click, even rapid ones. */
  actionSeq: number;
  /** What the visitor *intended* with the latest toggle. Set synchronously
   *  by toggle()/play()/pause() so consumers don't race the SC events. */
  lastAction: "play" | "pause" | null;
};

type MusicApi = MusicState & {
  toggle: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (ms: number) => void;
  dismiss: () => void;
};

const MusicCtx = createContext<MusicApi | null>(null);

export function useMusic(): MusicApi {
  const ctx = useContext(MusicCtx);
  if (!ctx) {
    throw new Error("useMusic must be used inside <MusicProvider>");
  }
  return ctx;
}

/* ──────────────────────────────────────────────────────────────────────
 * Provider — renders a hidden iframe (offscreen, 1×1) and exposes the
 * Widget API through context. Script + iframe only mount on first intent.
 * ────────────────────────────────────────────────────────────────────── */
export function MusicProvider({ children }: { children: React.ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SCWidget | null>(null);
  const [mounted, setMounted] = useState(false);

  const [state, setState] = useState<MusicState>({
    ready: false,
    loading: false,
    open: false,
    playing: false,
    position: 0,
    duration: 0,
    title: "",
    artist: "",
    artwork: null,
    permalink: null,
    actionSeq: 0,
    lastAction: null,
  });

  // Mirror the latest playing flag in a ref so toggle() can compute the
  // visitor's *intent* synchronously without waiting for the SC event.
  const playingRef = useRef(false);
  useEffect(() => {
    playingRef.current = state.playing;
  }, [state.playing]);

  const refreshSound = useCallback(() => {
    const w = widgetRef.current;
    if (!w) return;
    w.getCurrentSound((sound) => {
      if (!sound) return;
      const art = sound.artwork_url
        ? sound.artwork_url.replace("-large", "-t300x300")
        : null;
      setState((s) => ({
        ...s,
        title: sound.title || "",
        artist: sound.user?.username || "",
        artwork: art,
        duration: sound.duration || s.duration,
        permalink: sound.permalink_url || null,
      }));
    });
  }, []);

  // First-intent mount: load script, mount iframe, bind events.
  const ensureMounted = useCallback(async () => {
    if (mounted) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      await loadWidgetScript();
    } catch {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    setMounted(true);
  }, [mounted]);

  // Once iframe is in the DOM and SC is loaded, attach the widget.
  useEffect(() => {
    if (!mounted) return;
    const iframe = iframeRef.current;
    if (!iframe || !window.SC?.Widget) return;

    const w = window.SC.Widget(iframe);
    widgetRef.current = w;
    const E = window.SC.Widget.Events;

    // Throttle PLAY_PROGRESS — SC fires it 3-4×/s; we re-render at most
    // every 300ms. Position bar still feels live (CSS transition smooths
    // between samples), but we save ~12 react renders/s while idle on
    // the dock. Skip entirely while tab is hidden — no point updating UI
    // the user can't see, and it lets the browser throttle our work.
    let lastPos = 0;
    const onProgress = (data?: unknown) => {
      const now = performance.now();
      if (now - lastPos < 300) return;
      if (typeof document !== "undefined" && document.hidden) return;
      lastPos = now;
      const d = data as { currentPosition?: number };
      const pos = d?.currentPosition;
      if (typeof pos !== "number") return;
      setState((s) => (s.position === pos ? s : { ...s, position: pos }));
    };

    w.bind(E.READY, () => {
      setState((s) => ({ ...s, ready: true, loading: false, open: true }));
      refreshSound();
      w.getDuration((ms) =>
        setState((s) => ({ ...s, duration: ms || s.duration })),
      );
      w.play();
    });
    w.bind(E.PLAY, () => {
      setState((s) => ({ ...s, playing: true }));
      refreshSound();
    });
    w.bind(E.PAUSE, () => setState((s) => ({ ...s, playing: false })));
    w.bind(E.FINISH, () => setState((s) => ({ ...s, playing: false })));
    w.bind(E.PLAY_PROGRESS, onProgress);

    return () => {
      try {
        w.unbind(E.READY);
        w.unbind(E.PLAY);
        w.unbind(E.PAUSE);
        w.unbind(E.FINISH);
        w.unbind(E.PLAY_PROGRESS);
      } catch {
        /* iframe may already be torn down */
      }
    };
  }, [mounted, refreshSound]);

  // Bump the seq + record intent on every user-initiated toggle so that
  // toast consumers can fire reliably (even on rapid double-taps where
  // SC's PLAY/PAUSE events would coalesce).
  const noteAction = useCallback((next: "play" | "pause") => {
    setState((s) => ({
      ...s,
      lastAction: next,
      actionSeq: s.actionSeq + 1,
    }));
  }, []);

  const toggle = useCallback(() => {
    if (!mounted) {
      noteAction("play");
      void ensureMounted();
      return;
    }
    noteAction(playingRef.current ? "pause" : "play");
    widgetRef.current?.toggle();
  }, [mounted, ensureMounted, noteAction]);

  const play = useCallback(() => {
    if (!mounted) {
      noteAction("play");
      void ensureMounted();
      return;
    }
    noteAction("play");
    widgetRef.current?.play();
  }, [mounted, ensureMounted, noteAction]);

  const pause = useCallback(() => {
    noteAction("pause");
    widgetRef.current?.pause();
  }, [noteAction]);
  const next = useCallback(() => widgetRef.current?.next(), []);
  const prev = useCallback(() => widgetRef.current?.prev(), []);
  const seek = useCallback((ms: number) => widgetRef.current?.seekTo(ms), []);
  const dismiss = useCallback(() => {
    widgetRef.current?.pause();
    setState((s) => ({ ...s, open: false }));
  }, []);

  const api = useMemo<MusicApi>(
    () => ({ ...state, toggle, play, pause, next, prev, seek, dismiss }),
    [state, toggle, play, pause, next, prev, seek, dismiss],
  );

  // Iframe URL — autoplay enabled because mount only happens after a user gesture.
  const src = useMemo(() => {
    const u = new URL("https://w.soundcloud.com/player/");
    u.searchParams.set("url", PLAYLIST_URL);
    u.searchParams.set("auto_play", "true");
    u.searchParams.set("hide_related", "true");
    u.searchParams.set("show_comments", "false");
    u.searchParams.set("show_user", "false");
    u.searchParams.set("show_reposts", "false");
    u.searchParams.set("show_teaser", "false");
    u.searchParams.set("visual", "false");
    return u.toString();
  }, []);

  return (
    <MusicCtx.Provider value={api}>
      {children}
      {mounted ? (
        <iframe
          ref={iframeRef}
          src={src}
          title="Background audio (SoundCloud)"
          allow="autoplay"
          aria-hidden="true"
          tabIndex={-1}
          style={{
            position: "fixed",
            left: -9999,
            top: -9999,
            width: 1,
            height: 1,
            border: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </MusicCtx.Provider>
  );
}
