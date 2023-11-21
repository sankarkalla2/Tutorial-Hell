export const formatPrice:any = (number: number) => {
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);
};
