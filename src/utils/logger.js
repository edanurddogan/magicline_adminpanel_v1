import { api } from "boot/axios";

// Quasar/Vite projelerinde geliştirme modu tespiti için process.env.DEV veya import.meta.env.DEV kullanılmalı.
const isDev =
  // Quasar tarafından enjekte edilen bayrak
  (typeof process !== "undefined" && process.env && process.env.DEV) ||
  // Vite bayrağı (fallback)
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.DEV) ||
  // Bazı araçlar NODE_ENV'i de enjekte edebilir
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "development");

export default {
  log(...args) {
    if (isDev) {
      console.log(...args); // Sadece geliştirme ortamında çalışır
    }
  },
  warn(...args) {
    if (isDev) {
      console.warn(...args); // Sadece geliştirme ortamında çalışır
    }
  },
  error(...args) {
    if (isDev) {
      console.error(...args); // Sadece geliştirme ortamında çalışır
    }
  },
  crit(...args) {
    console.error(...args);
    // Kritik hatalar için API'ye gönder (baseURL: http://localhost:8091/api/)
    // Not: relative path kullanın; "/api/..." değil, "logError" gibi.
    try {
      const serialize = (val) => {
        if (val instanceof Error) {
          return `${val.message}${val.stack ? `\n${val.stack}` : ""}`;
        }
        if (typeof val === "string") return val;
        try {
          return JSON.stringify(val);
        } catch (_) {
          return String(val);
        }
      };
      const payload = {
        level: "crit",
        message: args.map(serialize).join(" "),
        url: typeof location !== "undefined" ? location.href : undefined,
        ts: new Date().toISOString(),
      };
      // Ağ hatalarını yut; uygulamayı bozmasın
      api.post("logError", payload).catch(() => {});
    } catch (_) {
      // yoksay
    }
  },
};
