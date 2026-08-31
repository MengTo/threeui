const PUBLIC_MEDIA_PATH = /^\/(?:previews|thumbnails)\//;

function runtimeEnv(name) {
  const value = import.meta.env?.[name];
  return typeof value === "string" ? value.trim() : "";
}

function normalizedBaseUrl(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function mediaOptions(options = {}) {
  return {
    baseUrl: normalizedBaseUrl(
      Object.hasOwn(options, "baseUrl") ? options.baseUrl : runtimeEnv("VITE_MEDIA_BASE_URL"),
    ),
    cacheNonce: String(
      Object.hasOwn(options, "cacheNonce") ? options.cacheNonce ?? "" : runtimeEnv("VITE_MEDIA_CACHE_NONCE"),
    ).trim(),
  };
}

export function isPublicMediaPath(value) {
  return typeof value === "string" && PUBLIC_MEDIA_PATH.test(value);
}

export function resolvePublicMediaUrl(localPath, options) {
  if (!isPublicMediaPath(localPath)) return localPath;
  const { baseUrl, cacheNonce } = mediaOptions(options);
  if (!baseUrl) return localPath;

  const url = new URL(localPath.replace(/^\/+/, ""), `${baseUrl}/`);
  if (cacheNonce) url.searchParams.set("cacheNonce", cacheNonce);
  return url.href;
}

export function localPublicMediaPath(value, options) {
  if (isPublicMediaPath(value)) return value;
  const { baseUrl } = mediaOptions(options);
  if (!baseUrl || typeof value !== "string" || !value.startsWith(`${baseUrl}/`)) return value;

  const url = new URL(value);
  return `/${url.pathname.slice(new URL(`${baseUrl}/`).pathname.length).replace(/^\/+/, "")}`;
}

export function fallbackToLocalMedia(element, localPath) {
  if (!element || !isPublicMediaPath(localPath) || element.dataset.mediaFallback === "local") return false;
  element.dataset.mediaFallback = "local";
  element.src = localPath;

  if (typeof element.load === "function" && typeof element.play === "function") {
    element.load();
    if (element.autoplay) void element.play().catch(() => undefined);
  }

  return true;
}

export function startResilientVideoPlayback(element, localPath, options = {}) {
  if (!element) return () => undefined;

  const documentRef = options.document ?? globalThis.document;
  const scheduleTimeout = options.setTimeout ?? globalThis.setTimeout;
  const cancelTimeout = options.clearTimeout ?? globalThis.clearTimeout;
  const startupWatchdogMs = options.startupWatchdogMs ?? 2_500;
  const playbackRetryMs = options.playbackRetryMs ?? 120;
  const maxPlaybackRetries = options.maxPlaybackRetries ?? 2;
  const maxLocalReloadAttempts = options.maxLocalReloadAttempts ?? 2;
  let cancelled = false;
  let playbackRequest = 0;
  let playbackRetryCount = 0;
  let playbackRetryTimer;
  let startupTimer;
  let localReloadAttempts = 0;
  const mediaErrorTimers = new Set();

  const isHidden = () => documentRef?.visibilityState === "hidden";
  const clearStartupWatchdog = () => {
    if (startupTimer !== undefined) cancelTimeout(startupTimer);
    startupTimer = undefined;
  };
  const clearPlaybackRetry = () => {
    if (playbackRetryTimer !== undefined) cancelTimeout(playbackRetryTimer);
    playbackRetryTimer = undefined;
  };
  const startPlayback = () => {
    if (cancelled || isHidden()) return;
    clearPlaybackRetry();
    element.muted = true;
    element.preload = "auto";
    const request = ++playbackRequest;
    const requestedSource = element.currentSrc || element.src;
    void element.play()
      .then(() => {
        if (cancelled || request !== playbackRequest) return;
        playbackRetryCount = 0;
        delete element.dataset.playbackError;
      })
      .catch((error) => {
        const currentSource = element.currentSrc || element.src;
        if (cancelled || request !== playbackRequest || currentSource !== requestedSource) return;

        const errorName = error instanceof DOMException ? error.name : "unknown";
        // A load(), visibility change, or route transition can interrupt an
        // otherwise valid play request. Retry playback without touching src;
        // only surface non-lifecycle failures.
        if (errorName === "AbortError" && playbackRetryCount < maxPlaybackRetries) {
          playbackRetryCount += 1;
          playbackRetryTimer = scheduleTimeout(() => {
            playbackRetryTimer = undefined;
            startPlayback();
          }, playbackRetryMs * playbackRetryCount);
          return;
        }
        if (errorName !== "AbortError") element.dataset.playbackError = errorName;
      });
  };
  const clearPlaybackError = () => {
    playbackRetryCount = 0;
    clearPlaybackRetry();
    delete element.dataset.playbackError;
  };
  const recoverToLocalMedia = () => {
    clearStartupWatchdog();
    clearPlaybackRetry();
    playbackRetryCount = 0;
    ++playbackRequest;
    delete element.dataset.playbackError;
    return fallbackToLocalMedia(element, localPath);
  };
  const recoverFromMediaError = () => {
    clearStartupWatchdog();
    const failedSource = element.currentSrc || element.src;
    const errorTimer = scheduleTimeout(() => {
      mediaErrorTimers.delete(errorTimer);
      const currentSource = element.currentSrc || element.src;
      // load() clears MediaError immediately, but a queued error event from a
      // superseded request can still arrive afterward. Recheck on the next task
      // and ignore it if the source or MediaError is no longer current.
      if (cancelled || currentSource !== failedSource || !element.error) return;
      if (recoverToLocalMedia()) return;
      if (element.dataset.mediaFallback === "local" && localReloadAttempts < maxLocalReloadAttempts) {
        localReloadAttempts += 1;
        clearPlaybackRetry();
        playbackRetryCount = 0;
        ++playbackRequest;
        delete element.dataset.playbackError;
        element.preload = "auto";
        element.load();
        startPlayback();
        return;
      }
      element.dataset.playbackError = "MediaError";
    }, 0);
    mediaErrorTimers.add(errorTimer);
  };
  const armStartupWatchdog = () => {
    clearStartupWatchdog();
    startupTimer = scheduleTimeout(() => {
      startupTimer = undefined;
      if (cancelled || isHidden() || element.readyState > 0) return;

      // A remote request that has not produced even metadata by the end of the
      // settle window is not making useful progress. Switch once to the stable,
      // cacheable same-origin copy. Never restart a source that already reached
      // metadata, and never append a cache-busting retry token.
      const sourceAttribute = element.getAttribute?.("src") ?? element.src;
      if (sourceAttribute !== localPath) {
        recoverToLocalMedia();
      }
    }, startupWatchdogMs);
  };
  const syncVisibility = () => {
    if (isHidden()) {
      clearStartupWatchdog();
      clearPlaybackRetry();
      ++playbackRequest;
      element.pause();
      return;
    }
    startPlayback();
    if (element.readyState === 0 && element.dataset.mediaFallback !== "local") armStartupWatchdog();
  };

  element.preload = "auto";
  element.addEventListener("loadedmetadata", clearStartupWatchdog);
  element.addEventListener("loadedmetadata", startPlayback);
  element.addEventListener("canplay", clearStartupWatchdog);
  element.addEventListener("canplay", startPlayback);
  element.addEventListener("playing", clearPlaybackError);
  element.addEventListener("error", recoverFromMediaError);
  documentRef?.addEventListener("visibilitychange", syncVisibility);
  startPlayback();
  armStartupWatchdog();

  return () => {
    cancelled = true;
    ++playbackRequest;
    clearStartupWatchdog();
    clearPlaybackRetry();
    for (const timer of mediaErrorTimers) cancelTimeout(timer);
    mediaErrorTimers.clear();
    element.removeEventListener("loadedmetadata", clearStartupWatchdog);
    element.removeEventListener("loadedmetadata", startPlayback);
    element.removeEventListener("canplay", clearStartupWatchdog);
    element.removeEventListener("canplay", startPlayback);
    element.removeEventListener("playing", clearPlaybackError);
    element.removeEventListener("error", recoverFromMediaError);
    documentRef?.removeEventListener("visibilitychange", syncVisibility);
    element.pause();
    // Explicitly detach the old route's source so the browser can release the
    // request and decoder before the next catalog preview mounts.
    element.removeAttribute?.("src");
    element.load?.();
  };
}
