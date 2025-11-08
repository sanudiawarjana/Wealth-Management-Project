import { apiClient } from './api-client';
import type { Income, Asset, Liability, CreditCard, Recommendation } from './types';

// Backend API models (match backend schema)
interface BackendIncome {
  _id: string;
  source: string;
  amount: number;
  currency: string;
  frequency: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendAsset {
  _id: string;
  name: string;
  type: string;
  value: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendLiability {
  _id: string;
  name: string;
  type: string;
  amount: number;
  currency: string;
  interestRate?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendCreditCard {
  _id: string;
  bank: string;
  last4: string;
  creditLimit: number;
  outstandingBalance: number;
  currency: string;
  paymentDueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Mappers: Backend <-> Frontend
const mapBackendToFrontendIncome = (item: BackendIncome): Income => ({
  id: item._id,
  source: item.source,
  amount: item.amount,
  currency: item.currency as any,
  frequency: item.frequency as any,
  date: item.createdAt,
});

const mapBackendToFrontendAsset = (item: BackendAsset): Asset => ({
  id: item._id,
  name: item.name,
  type: item.type as any,
  value: item.value,
  currency: item.currency as any,
  date: item.createdAt,
});

const mapBackendToFrontendLiability = (item: BackendLiability): Liability => ({
  id: item._id,
  name: item.name,
  type: item.type as any,
  amount: item.amount,
  currency: item.currency as any,
  interestRate: item.interestRate || 0,
  date: item.createdAt,
});

const mapBackendToFrontendCreditCard = (item: BackendCreditCard): CreditCard => ({
  id: item._id,
  bank: item.bank,
  lastFourDigits: item.last4,
  limit: item.creditLimit,
  outstanding: item.outstandingBalance,
  currency: item.currency as any,
  dueDate: item.paymentDueDate || '',
});

// Income API Services
export const incomeService = {
  getAll: async () => {
    const response = await apiClient.get<BackendIncome[]>('/income');
    if (response.success && response.data) {
      return response.data.map(mapBackendToFrontendIncome);
    }
    throw new Error(response.error || 'Failed to fetch income');
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendIncome>(`/income/${id}`);
    if (response.success && response.data) {
      return mapBackendToFrontendIncome(response.data);
    }
    throw new Error(response.error || 'Failed to fetch income');
  },

  create: async (income: Omit<Income, 'id'>) => {
    const response = await apiClient.post<BackendIncome>('/income', {
      source: income.source,
      amount: income.amount,
      currency: income.currency,
      frequency: income.frequency,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendIncome(response.data);
    }
    throw new Error(response.error || 'Failed to create income');
  },

  update: async (id: string, income: Omit<Income, 'id'>) => {
    const response = await apiClient.put<BackendIncome>(`/income/${id}`, {
      source: income.source,
      amount: income.amount,
      currency: income.currency,
      frequency: income.frequency,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendIncome(response.data);
    }
    throw new Error(response.error || 'Failed to update income');
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/income/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete income');
    }
  },
};

// Asset API Services
export const assetService = {
  getAll: async () => {
    const response = await apiClient.get<BackendAsset[]>('/assets');
    if (response.success && response.data) {
      return response.data.map(mapBackendToFrontendAsset);
    }
    throw new Error(response.error || 'Failed to fetch assets');
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendAsset>(`/assets/${id}`);
    if (response.success && response.data) {
      return mapBackendToFrontendAsset(response.data);
    }
    throw new Error(response.error || 'Failed to fetch asset');
  },

  create: async (asset: Omit<Asset, 'id'>) => {
    const response = await apiClient.post<BackendAsset>('/assets', {
      name: asset.name,
      type: asset.type,
      value: asset.value,
      currency: asset.currency,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendAsset(response.data);
    }
    throw new Error(response.error || 'Failed to create asset');
  },

  update: async (id: string, asset: Omit<Asset, 'id'>) => {
    const response = await apiClient.put<BackendAsset>(`/assets/${id}`, {
      name: asset.name,
      type: asset.type,
      value: asset.value,
      currency: asset.currency,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendAsset(response.data);
    }
    throw new Error(response.error || 'Failed to update asset');
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/assets/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete asset');
    }
  },
};

// Liability API Services
export const liabilityService = {
  getAll: async () => {
    const response = await apiClient.get<BackendLiability[]>('/liabilities');
    if (response.success && response.data) {
      return response.data.map(mapBackendToFrontendLiability);
    }
    throw new Error(response.error || 'Failed to fetch liabilities');
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendLiability>(`/liabilities/${id}`);
    if (response.success && response.data) {
      return mapBackendToFrontendLiability(response.data);
    }
    throw new Error(response.error || 'Failed to fetch liability');
  },

  create: async (liability: Omit<Liability, 'id'>) => {
    const response = await apiClient.post<BackendLiability>('/liabilities', {
      name: liability.name,
      type: liability.type,
      amount: liability.amount,
      currency: liability.currency,
      interestRate: liability.interestRate,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendLiability(response.data);
    }
    throw new Error(response.error || 'Failed to create liability');
  },

  update: async (id: string, liability: Omit<Liability, 'id'>) => {
    const response = await apiClient.put<BackendLiability>(`/liabilities/${id}`, {
      name: liability.name,
      type: liability.type,
      amount: liability.amount,
      currency: liability.currency,
      interestRate: liability.interestRate,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendLiability(response.data);
    }
    throw new Error(response.error || 'Failed to update liability');
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/liabilities/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete liability');
    }
  },
};

// Credit Card API Services
export const creditCardService = {
  getAll: async () => {
    const response = await apiClient.get<BackendCreditCard[]>('/creditcards');
    if (response.success && response.data) {
      return response.data.map(mapBackendToFrontendCreditCard);
    }
    throw new Error(response.error || 'Failed to fetch credit cards');
  },

  getById: async (id: string) => {
    const response = await apiClient.get<BackendCreditCard>(`/creditcards/${id}`);
    if (response.success && response.data) {
      return mapBackendToFrontendCreditCard(response.data);
    }
    throw new Error(response.error || 'Failed to fetch credit card');
  },

  create: async (card: Omit<CreditCard, 'id'>) => {
    const response = await apiClient.post<BackendCreditCard>('/creditcards', {
      bank: card.bank,
      last4: card.lastFourDigits,
      creditLimit: card.limit,
      outstandingBalance: card.outstanding,
      currency: card.currency,
      paymentDueDate: card.dueDate || undefined,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendCreditCard(response.data);
    }
    throw new Error(response.error || 'Failed to create credit card');
  },

  update: async (id: string, card: Omit<CreditCard, 'id'>) => {
    const response = await apiClient.put<BackendCreditCard>(`/creditcards/${id}`, {
      bank: card.bank,
      last4: card.lastFourDigits,
      creditLimit: card.limit,
      outstandingBalance: card.outstanding,
      currency: card.currency,
      paymentDueDate: card.dueDate || undefined,
    });
    if (response.success && response.data) {
      return mapBackendToFrontendCreditCard(response.data);
    }
    throw new Error(response.error || 'Failed to update credit card');
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/creditcards/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete credit card');
    }
  },
};

// Recommendation API Service
export const recommendationService = {
  generate: async () => {
    const response = await apiClient.post<{ recommendations: any; textSummary: string }>('/recommendations', {});
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to generate recommendations');
  },
};
