//src/utils/logger.js
import { boot } from "quasar/wrappers";
import logger from "../utils/logger";

export default boot(({ app }) => {
  app.config.globalProperties.$logger = logger;

  // Global erişim: component dışındaki modüller, store'lar vb. yerlerden import etmeden kullanabilmek için
  try {
    const g =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
        ? window
        : undefined;
    if (g) {
      // Nesne olarak
      g.$logger = g.$logger || logger;
      g.logger = g.logger || logger;

      // Kısa yol fonksiyonlar
      if (!g.$log) g.$log = logger.log.bind(logger);
      if (!g.$warn) g.$warn = logger.warn.bind(logger);
      if (!g.$error) g.$error = logger.error.bind(logger);
      if (!g.$crit) g.$crit = logger.crit.bind(logger);
    }
  } catch (e) {
    // Sessizce yoksay (ör. çok erken init veya sıra dışı ortamlar)
  }
});
