export const numberFormat = (num) => {
    return Intl.NumberFormat("en-us", { notation: "compact" }).format(num)
}