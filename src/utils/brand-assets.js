import { firm } from "../../package.json";
import canenerjiLogo from "src/assets/logo/canenerji/logo.png";
import canenerjiLogo2 from "src/assets/logo/canenerji/logo2.png";
import e4sarjLogo from "src/assets/logo/e4sarj/logo.png";
import e4sarjLogo2 from "src/assets/logo/e4sarj/logo2.png";
import magiclineLogo from "src/assets/logo/magicline/logo.png";
import magiclineLogo2 from "src/assets/logo/magicline/logo2.png";
import loginBgLight from "src/assets/loginbg1.jpg";
import loginBgDark from "src/assets/loginbg4.jpg";
const brandAssetMap = {
  canenerji: {
    logo: canenerjiLogo,
    logo2: canenerjiLogo2,
  },
  e4sarj: {
    logo: e4sarjLogo,
    logo2: e4sarjLogo2,
  },
  magicline: {
    logo: magiclineLogo,
    logo2: magiclineLogo2,
  },
};

export const brandAssets =
  brandAssetMap[firm.code] || brandAssetMap.magicline;

export const loginBackgrounds = {
  light: loginBgLight,
  dark: loginBgDark,
};
