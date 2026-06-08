import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import { watch } from "vue";
import messages from "src/i18n";
import { Quasar } from "quasar";
import tr from "quasar/lang/tr";
import enUS from "quasar/lang/en-US";

const i18n = createI18n({
  locale: Quasar.lang.getLocale().split("-")[0],
  fallbackLocale: "tr",
  globalInjection: true,
  messages,
});

const getQuasarLang = (locale) => {
  const normalized = (locale || "tr").toString().split("-")[0];

  if (normalized === "tr") {
    return {
      ...tr,
      table: {
        ...tr.table,
      },
    };
  }

  return {
    ...enUS,
    table: {
      ...enUS.table,
    },
  };
};

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);

  const initialLocale =
    typeof i18n.global.locale === "object"
      ? i18n.global.locale.value
      : i18n.global.locale;
  Quasar.lang.set(getQuasarLang(initialLocale));

  if (typeof i18n.global.locale === "object") {
    watch(i18n.global.locale, (val) => {
      Quasar.lang.set(getQuasarLang(val));
    });
  }
});

export { i18n };
