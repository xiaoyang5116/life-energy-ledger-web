import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getUserSettings, saveUserSettings } from "@/features/ledger/storage"
import type { UserSettings } from "@/features/ledger/model"

export const userSettingsQueryKey = ["userSettings"]

export function useUserSettings() {
  return useQuery({
    queryKey: userSettingsQueryKey,
    queryFn: getUserSettings,
    staleTime: Infinity,
    initialData: getUserSettings(),
  })
}

export function useSaveUserSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: Omit<UserSettings, "id">) => {
      saveUserSettings(settings)
      return getUserSettings()
    },

    onSuccess: (data) => {
      queryClient.setQueryData(userSettingsQueryKey, data)
    },
  })
}
