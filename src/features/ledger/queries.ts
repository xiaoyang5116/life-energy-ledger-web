import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type {
  AutoReviewRule,
  LifeFlowCategory,
  RawTransaction,
  Transaction,
} from "@/features/ledger/model"
import {
  getAutoReviewRules,
  getLifeFlowCategories,
  getTransactions,
  saveAutoReviewRules,
  saveLifeFlowCategories,
  saveTransactions,
} from "@/features/ledger/storage"

export const transactionsQueryKey = ["transactions"]
export const lifeFlowCategoriesQueryKey = ["lifeFlowCategories"]
export const autoReviewRulesQueryKey = ["autoReviewRules"]

export function useTransactions() {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: getTransactions,
    staleTime: Infinity,
    initialData: getTransactions(),
  })
}

export function useSaveTransactions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactions: Transaction[]) => {
      saveTransactions(transactions)
      return getTransactions()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(transactionsQueryKey, data)
    },
  })
}

export function useAppendTransactions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: RawTransaction) => {
      const previousTransactions = getTransactions()

      let newTransactions: RawTransaction[] = []

      if (!previousTransactions) {
        newTransactions = [transaction]
      } else {
        newTransactions = [...previousTransactions, transaction]
      }

      saveTransactions(newTransactions)
      return newTransactions
    },
    onSuccess: (data) => {
      queryClient.setQueryData(transactionsQueryKey, data)
    },
  })
}

export function useLifeFlowCategories() {
  return useQuery({
    queryKey: lifeFlowCategoriesQueryKey,
    queryFn: getLifeFlowCategories,
    staleTime: Infinity,
    initialData: getLifeFlowCategories(),
  })
}

export function useSaveLifeFlowCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (lifeFlowCategories: LifeFlowCategory[]) => {
      saveLifeFlowCategories(lifeFlowCategories)
      return getLifeFlowCategories()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(lifeFlowCategoriesQueryKey, data)
    },
  })
}

export function useAutoReviewRules() {
  return useQuery({
    queryKey: autoReviewRulesQueryKey,
    queryFn: getAutoReviewRules,
    staleTime: Infinity,
    initialData: getAutoReviewRules(),
  })
}

export function useSaveAutoReviewRules() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rules: AutoReviewRule[]) => {
      saveAutoReviewRules(rules)
      return getAutoReviewRules()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(autoReviewRulesQueryKey, data)
    },
  })
}
