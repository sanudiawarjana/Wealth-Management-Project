export type Currency = "LKR" | "USD" | "EUR"

export interface Income {
  id: string
  source: string
  amount: number
  currency: Currency
  frequency: "monthly" | "yearly" | "one-time"
  date: string
}

export interface Asset {
  id: string
  name: string
  type: "property" | "investment" | "savings" | "other"
  value: number
  currency: Currency
  date: string
}

export interface Liability {
  id: string
  name: string
  type: "loan" | "mortgage" | "other"
  amount: number
  currency: Currency
  interestRate: number
  date: string
}

export interface CreditCard {
  id: string
  bank: string
  lastFourDigits: string
  limit: number
  outstanding: number
  currency: Currency
  dueDate: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  category: "savings" | "investment" | "debt" | "spending"
  status: "pending" | "in-progress" | "completed" | "dismissed"
  createdAt: string
}

export interface FinancialData {
  income: Income[]
  assets: Asset[]
  liabilities: Liability[]
  creditCards: CreditCard[]
  recommendations: Recommendation[]
}
