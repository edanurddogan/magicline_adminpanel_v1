import { boot } from "quasar/wrappers";
import { normalizeTurkishString } from "../utils/utils";

export default boot(({ app }) => {
  // Add the function to the global properties
  app.config.globalProperties.$normalizeTurkishString = normalizeTurkishString;
});
