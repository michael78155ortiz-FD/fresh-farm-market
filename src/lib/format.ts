// src/lib/format.ts
export const money = (cents: number, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    (Number.isFinite(cents) ? cents : 0) / 100
  );
