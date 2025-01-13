export const numberFormat = (num: number) => {
  return Intl.NumberFormat("en-us", { notation: "compact" }).format(num);
};
