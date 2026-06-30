import type { UserSettings } from "@/features/ledger/model"

const STORAGE_KEY = "fire-tracker:app-data"

type AppStorageV1 = {
  version: 1
  userSettings: UserSettings | null
  transactions: []
  categories: []
  autoReviewRules: []
}

function isBrowser() {
  return typeof window !== "undefined"
}

function createDefaultData(): AppStorageV1 {
  return {
    version: 1,
    userSettings: null,
    transactions: [],
    categories: [],
    autoReviewRules: [],
  }
}

function loadRaw(): AppStorageV1 {
  if (!isBrowser()) {
    return createDefaultData()
  }

  const rawData = localStorage.getItem(STORAGE_KEY)
  if (!rawData) {
    return createDefaultData()
  }

  try {
    const parsed = JSON.parse(rawData) as Partial<AppStorageV1>
    if (parsed.version !== 1) {
      return createDefaultData()
    }

    // 确保即使解析成功，也有默认的空数组兜底
    return {
      version: 1,
      userSettings: parsed.userSettings ?? null,
      transactions: parsed.transactions ?? [],
      categories: parsed.categories ?? [],
      autoReviewRules: parsed.autoReviewRules ?? [],
    }
  } catch {
    return createDefaultData()
  }
}

function saveRaw(data: AppStorageV1) {
  if (!isBrowser()) {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// --- 对外 API ---

export function getUserSettings(): UserSettings | null {
  return loadRaw().userSettings
}

export function saveUserSettings(userSettings: Omit<UserSettings, "id">) {
  const data = loadRaw()

  if (data.userSettings && data.userSettings.id) {
    data.userSettings = {
      ...data.userSettings,
      ...userSettings,
      updatedAt: new Date().toISOString(),
    }
  } else {
    data.userSettings = {
      ...userSettings,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  saveRaw(data)
}
