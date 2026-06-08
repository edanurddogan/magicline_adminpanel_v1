import { boot } from "quasar/wrappers";
import { firm } from "../../package.json";

export function formatPageTitle(title) {
  const suffix = typeof title === "string" ? title.trim() : "";
  return suffix ? `${firm.name} - ${suffix}` : firm.name;
}

export default boot(({ app }) => {
  app.config.globalProperties.$setPageTitle = (title) => {
    document.title = formatPageTitle(title);
  };
});
