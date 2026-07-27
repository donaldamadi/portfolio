export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "da-theme";

/**
 * Inlined into <head> before paint so the correct theme is applied on the very
 * first frame. Without this you get a flash of the wrong palette on every load,
 * which is the single most common tell of a site nobody finished.
 */
export const themeBootstrapScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored === "light" || stored === "dark" ? stored : (prefersLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`.trim();
