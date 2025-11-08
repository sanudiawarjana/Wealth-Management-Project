import type { Currency } from "./types"

export const EXCHANGE_RATES: Record<Currency, number> = {
  LKR: 1,
  USD: 300,
  EUR: 330,
}

export function convertToLKR(amount: number, currency: Currency): number {
  return amount * EXCHANGE_RATES[currency]
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    LKR: "Rs.",
    USD: "$",
    EUR: "€",
  }

  return `${symbols[currency]} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
