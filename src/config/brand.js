import {
  author as packageAuthor,
  firm as packageFirm,
  productName as packageProductName,
  version as packageVersion,
} from "../../package.json";

const fallbackCode = packageFirm?.code || "magicline";

const logoMap = {
  magicline: {
    logo: new URL("../assets/logo/magicline/logo.png", import.meta.url).href,
    logo2: new URL("../assets/logo/magicline/logo2.png", import.meta.url).href,
  },
  e4sarj: {
    logo: new URL("../assets/logo/e4sarj/logo.png", import.meta.url).href,
    logo2: new URL("../assets/logo/e4sarj/logo2.png", import.meta.url).href,
  },
  canenerji: {
    logo: new URL("../assets/logo/canenerji/logo.png", import.meta.url).href,
    logo2: new URL("../assets/logo/canenerji/logo2.png", import.meta.url).href,
  },
};

const activeCode = import.meta.env.VITE_FIRM_CODE || fallbackCode;
const activeName = import.meta.env.VITE_FIRM_NAME || packageFirm?.name || "Magicline";

export const firm = {
  ...packageFirm,
  code: activeCode,
  name: activeName,
};

export const brandAssets = logoMap[activeCode] || logoMap[fallbackCode] || logoMap.magicline;

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://api.magiclineapp.com/api/";

export const notificationBrandName =
  import.meta.env.VITE_NOTIFICATION_BRAND_NAME || activeName;

export const productName =
  import.meta.env.VITE_PRODUCT_NAME || packageProductName;

export const author = packageAuthor;
export const version = packageVersion;
