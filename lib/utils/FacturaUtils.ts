export const formatedFacturaNumber = (x: string) =>
  x.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
