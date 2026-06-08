export function normalizeTurkishString(str) {
  const turkishMap = {
    Ç: "C",
    ç: "c",
    Ğ: "G",
    ğ: "g",
    İ: "I",
    ı: "i",
    Ö: "O",
    ö: "o",
    Ş: "S",
    ş: "s",
    Ü: "U",
    ü: "u",
  };

  return str
    .split("")
    .map((char) => turkishMap[char] || char)
    .join("")
    .toLowerCase();
}

export default {
  install(Vue) {
    Vue.prototype.$normalizeTurkishString = normalizeTurkishString;
  },
};
