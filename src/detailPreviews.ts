export function resolveDetailPreviewSource(fallback: string) {
  const absolute = /^https?:\/\//i.test(fallback);
  const url = new URL(fallback, "https://threeui.local");
  const filename = url.pathname.split("/").pop();
  if (!filename || !/\.(?:mp4|webm)$/i.test(filename)) return fallback;
  const previewIndex = url.pathname.lastIndexOf("/previews/");
  if (previewIndex < 0) return fallback;

  url.pathname = `${url.pathname.slice(0, previewIndex)}/previews/detail/${filename.replace(/\.(?:mp4|webm)$/i, ".webm")}`;
  return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`;
}
