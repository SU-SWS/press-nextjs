export const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD"
  })
  return formatter.format(amount);
}