import { firm } from "../../package.json";

const defaultBrandName = firm.name || "Magicline";

const brandCopyMap = {
  magicline: {
    headquartersTr: "Magicline Enerji",
    headquartersEn: "Magicline Energy",
    websiteTitle: "Magicline Web",
    primaryWebsite: "magiclinesarj.com (TR)",
    secondaryWebsite: "magiclineenergy.com (BG)",
  },
  e4sarj: {
    headquartersTr: "E4sarj",
    headquartersEn: "E4sarj",
    websiteTitle: "E4sarj Web",
    primaryWebsite: "e4sarj.com.tr",
    secondaryWebsite: "",
  },
  canenerji: {
    headquartersTr: "Can Enerji",
    headquartersEn: "Can Enerji",
    websiteTitle: "Can Enerji Web",
    primaryWebsite: "canenerji.com.tr",
    secondaryWebsite: "",
  },
};

const activeBrandCopy = brandCopyMap[firm.code] || {
  headquartersTr: defaultBrandName,
  headquartersEn: defaultBrandName,
  websiteTitle: `${defaultBrandName} Web`,
  primaryWebsite: defaultBrandName,
  secondaryWebsite: "",
};

export const brandCopy = {
  ...activeBrandCopy,
  companyInfoTitleTr: `${defaultBrandName} - Firma Bilgileri`,
  companyInfoTitleEn: `${defaultBrandName} - Company Information`,
  displayName: defaultBrandName,
};
