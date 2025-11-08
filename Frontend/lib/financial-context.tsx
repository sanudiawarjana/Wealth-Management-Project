"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { FinancialData, Income, Asset, Liability, CreditCard, Recommendation } from "./types"
import { generateRecommendations } from "./ai-recommendations"
import {
  incomeService,
  assetService,
  liabilityService,
  creditCardService,
  recommendationService,
} from "./api-services"
import { useToast } from "@/hooks/use-toast"

interface FinancialContextType {
  data: FinancialData
  loading: boolean
  addIncome: (income: Omit<Income, "id">) => Promise<void>
  updateIncome: (id: string, income: Omit<Income, "id">) => Promise<void>
  addAsset: (asset: Omit<Asset, "id">) => Promise<void>
  updateAsset: (id: string, asset: Omit<Asset, "id">) => Promise<void>
  addLiability: (liability: Omit<Liability, "id">) => Promise<void>
  updateLiability: (id: string, liability: Omit<Liability, "id">) => Promise<void>
  addCreditCard: (card: Omit<CreditCard, "id">) => Promise<void>
  updateCreditCard: (id: string, card: Omit<CreditCard, "id">) => Promise<void>
  addRecommendation: (recommendation: Omit<Recommendation, "id" | "createdAt">) => void
  updateRecommendation: (id: string, status: Recommendation["status"]) => void
  deleteIncome: (id: string) => Promise<void>
  deleteAsset: (id: string) => Promise<void>
  deleteLiability: (id: string) => Promise<void>
  deleteCreditCard: (id: string) => Promise<void>
  generateAIRecommendations: () => Promise<void>
  refreshData: () => Promise<void>
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

const STORAGE_KEY = "wealth-management-data"

const initialData: FinancialData = {
  income: [],
  assets: [],
  liabilities: [],
  creditCards: [],
  recommendations: [
    {
      id: "1",
      title: "Build Emergency Fund",
      description: "Aim to save 3-6 months of expenses in a liquid savings account for unexpected situations.",
      category: "savings",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Diversify Investments",
      description: "Consider spreading your investments across different asset classes to reduce risk.",
      category: "investment",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Pay Down High-Interest Debt",
      description: "Focus on paying off credit cards and loans with interest rates above 10% first.",
      category: "debt",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ],
}

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinancialData>(initialData)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Load data from backend on mount
  const refreshData = async () => {
    setLoading(true)
    try {
      const [incomes, assets, liabilities, creditCards] = await Promise.all([
        incomeService.getAll(),
        assetService.getAll(),
        liabilityService.getAll(),
        creditCardService.getAll(),
      ])

      setData((prev) => ({
        ...prev,
        income: incomes,
        assets,
        liabilities,
        creditCards,
      }))
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const addIncome = async (income: Omit<Income, "id">) => {
    try {
      const newIncome = await incomeService.create(income)
      setData((prev) => ({
        ...prev,
        income: [...prev.income, newIncome],
      }))
      toast({ title: "Success", description: "Income added successfully" })
    } catch (error) {
      console.error('Failed to add income:', error)
      toast({ title: "Error", description: "Failed to add income", variant: "destructive" })
      throw error
    }
  }

  const updateIncome = async (id: string, income: Omit<Income, "id">) => {
    try {
      const updated = await incomeService.update(id, income)
      setData((prev) => ({
        ...prev,
        income: prev.income.map((item) => (item.id === id ? updated : item)),
      }))
      toast({ title: "Success", description: "Income updated successfully" })
    } catch (error) {
      console.error('Failed to update income:', error)
      toast({ title: "Error", description: "Failed to update income", variant: "destructive" })
      throw error
    }
  }

  const addAsset = async (asset: Omit<Asset, "id">) => {
    try {
      const newAsset = await assetService.create(asset)
      setData((prev) => ({
        ...prev,
        assets: [...prev.assets, newAsset],
      }))
      toast({ title: "Success", description: "Asset added successfully" })
    } catch (error) {
      console.error('Failed to add asset:', error)
      toast({ title: "Error", description: "Failed to add asset", variant: "destructive" })
      throw error
    }
  }

  const updateAsset = async (id: string, asset: Omit<Asset, "id">) => {
    try {
      const updated = await assetService.update(id, asset)
      setData((prev) => ({
        ...prev,
        assets: prev.assets.map((item) => (item.id === id ? updated : item)),
      }))
      toast({ title: "Success", description: "Asset updated successfully" })
    } catch (error) {
      console.error('Failed to update asset:', error)
      toast({ title: "Error", description: "Failed to update asset", variant: "destructive" })
      throw error
    }
  }

  const addLiability = async (liability: Omit<Liability, "id">) => {
    try {
      const newLiability = await liabilityService.create(liability)
      setData((prev) => ({
        ...prev,
        liabilities: [...prev.liabilities, newLiability],
      }))
      toast({ title: "Success", description: "Liability added successfully" })
    } catch (error) {
      console.error('Failed to add liability:', error)
      toast({ title: "Error", description: "Failed to add liability", variant: "destructive" })
      throw error
    }
  }

  const updateLiability = async (id: string, liability: Omit<Liability, "id">) => {
    try {
      const updated = await liabilityService.update(id, liability)
      setData((prev) => ({
        ...prev,
        liabilities: prev.liabilities.map((item) => (item.id === id ? updated : item)),
      }))
      toast({ title: "Success", description: "Liability updated successfully" })
    } catch (error) {
      console.error('Failed to update liability:', error)
      toast({ title: "Error", description: "Failed to update liability", variant: "destructive" })
      throw error
    }
  }

  const addCreditCard = async (card: Omit<CreditCard, "id">) => {
    try {
      const newCard = await creditCardService.create(card)
      setData((prev) => ({
        ...prev,
        creditCards: [...prev.creditCards, newCard],
      }))
      toast({ title: "Success", description: "Credit card added successfully" })
    } catch (error) {
      console.error('Failed to add credit card:', error)
      toast({ title: "Error", description: "Failed to add credit card", variant: "destructive" })
      throw error
    }
  }

  const updateCreditCard = async (id: string, card: Omit<CreditCard, "id">) => {
    try {
      const updated = await creditCardService.update(id, card)
      setData((prev) => ({
        ...prev,
        creditCards: prev.creditCards.map((item) => (item.id === id ? updated : item)),
      }))
      toast({ title: "Success", description: "Credit card updated successfully" })
    } catch (error) {
      console.error('Failed to update credit card:', error)
      toast({ title: "Error", description: "Failed to update credit card", variant: "destructive" })
      throw error
    }
  }

  const updateRecommendation = (id: string, status: Recommendation["status"]) => {
    setData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((rec) => (rec.id === id ? { ...rec, status } : rec)),
    }))
  }

  const addRecommendation = (recommendation: Omit<Recommendation, "id" | "createdAt">) => {
    const newRecommendation: Recommendation = {
      ...recommendation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setData((prev) => ({
      ...prev,
      recommendations: [...prev.recommendations, newRecommendation],
    }))
  }

  const deleteIncome = async (id: string) => {
    try {
      await incomeService.delete(id)
      setData((prev) => ({
        ...prev,
        income: prev.income.filter((item) => item.id !== id),
      }))
      toast({ title: "Success", description: "Income deleted successfully" })
    } catch (error) {
      console.error('Failed to delete income:', error)
      toast({ title: "Error", description: "Failed to delete income", variant: "destructive" })
      throw error
    }
  }

  const deleteAsset = async (id: string) => {
    try {
      await assetService.delete(id)
      setData((prev) => ({
        ...prev,
        assets: prev.assets.filter((item) => item.id !== id),
      }))
      toast({ title: "Success", description: "Asset deleted successfully" })
    } catch (error) {
      console.error('Failed to delete asset:', error)
      toast({ title: "Error", description: "Failed to delete asset", variant: "destructive" })
      throw error
    }
  }

  const deleteLiability = async (id: string) => {
    try {
      await liabilityService.delete(id)
      setData((prev) => ({
        ...prev,
        liabilities: prev.liabilities.filter((item) => item.id !== id),
      }))
      toast({ title: "Success", description: "Liability deleted successfully" })
    } catch (error) {
      console.error('Failed to delete liability:', error)
      toast({ title: "Error", description: "Failed to delete liability", variant: "destructive" })
      throw error
    }
  }

  const deleteCreditCard = async (id: string) => {
    try {
      await creditCardService.delete(id)
      setData((prev) => ({
        ...prev,
        creditCards: prev.creditCards.filter((item) => item.id !== id),
      }))
      toast({ title: "Success", description: "Credit card deleted successfully" })
    } catch (error) {
      console.error('Failed to delete credit card:', error)
      toast({ title: "Error", description: "Failed to delete credit card", variant: "destructive" })
      throw error
    }
  }

  const generateAIRecommendations = async () => {
    try {
      const result = await recommendationService.generate()
      // Process and add AI recommendations to state
      const newRecommendations = Array.isArray(result.recommendations)
        ? result.recommendations.map((rec: any) => ({
            id: crypto.randomUUID(),
            title: rec.title || 'Recommendation',
            description: rec.detail || rec.description || '',
            category: rec.category || 'savings',
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          }))
        : []

      setData((prev) => ({
        ...prev,
        recommendations: [...prev.recommendations, ...newRecommendations],
      }))

      toast({ title: "Success", description: "AI recommendations generated successfully" })
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error)
      toast({ title: "Error", description: "Failed to generate AI recommendations", variant: "destructive" })
      throw error
    }
  }

  return (
    <FinancialContext.Provider
      value={{
        data,
        loading,
        addIncome,
        updateIncome,
        addAsset,
        updateAsset,
        addLiability,
        updateLiability,
        addCreditCard,
        updateCreditCard,
        addRecommendation,
        updateRecommendation,
        deleteIncome,
        deleteAsset,
        deleteLiability,
        deleteCreditCard,
        generateAIRecommendations,
        refreshData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error("useFinancial must be used within FinancialProvider")
  }
  return context
}
