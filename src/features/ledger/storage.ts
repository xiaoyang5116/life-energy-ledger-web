import { getDefaultLifeFlowCategories } from "@/features/ledger/lifeFlowCategories"
import type {
  AutoReviewRule,
  LifeFlowCategory,
  Transaction,
  UserSettings,
} from "@/features/ledger/model"

const STORAGE_KEY = "fire-tracker:app-data"

type AppStorageV1 = {
  version: 1
  userSettings: UserSettings | null
  transactions: Transaction[]
  lifeFlowCategories: LifeFlowCategory[]
  autoReviewRules: AutoReviewRule[]
}

function isBrowser() {
  return typeof window !== "undefined"
}

function createDefaultData(): AppStorageV1 {
  return {
    version: 1,
    userSettings: null,
    transactions: [],
    lifeFlowCategories: getDefaultLifeFlowCategories(),
    autoReviewRules: [],
  }
}

// 确保默认生命流向分类
function ensureDefaultCategories(data: AppStorageV1): AppStorageV1 {
  if (data.lifeFlowCategories.length > 0) {
    return data
  }

  const initialized = {
    ...data,
    lifeFlowCategories: getDefaultLifeFlowCategories(),
  }
  saveRaw(initialized)
  return initialized
}

function loadRaw(): AppStorageV1 {
  if (!isBrowser()) {
    return createDefaultData()
  }

  const rawData = localStorage.getItem(STORAGE_KEY)
  if (!rawData) {
    const defaultData = createDefaultData()
    saveRaw(defaultData)
    return defaultData
  }

  try {
    const parsed = JSON.parse(rawData) as Partial<AppStorageV1>
    if (parsed.version !== 1) {
      const defaultData = createDefaultData()
      saveRaw(defaultData)
      return defaultData
    }

    const data: AppStorageV1 = {
      version: 1,
      userSettings: parsed.userSettings ?? null,
      transactions: parsed.transactions ?? [],
      lifeFlowCategories: parsed.lifeFlowCategories ?? [],
      autoReviewRules: parsed.autoReviewRules ?? [],
    }

    return ensureDefaultCategories(data)
  } catch {
    const defaultData = createDefaultData()
    saveRaw(defaultData)
    return defaultData
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
      id: createId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  saveRaw(data)
}

export function getTransactions(): Transaction[] {
  return loadRaw().transactions
}

export function saveTransactions(transactions: Transaction[]) {
  const data = loadRaw()
  data.transactions = transactions
  saveRaw(data)
}

export function getLifeFlowCategories(): LifeFlowCategory[] {
  return loadRaw().lifeFlowCategories
}

export function saveLifeFlowCategories(lifeFlowCategories: LifeFlowCategory[]) {
  const data = loadRaw()
  data.lifeFlowCategories = lifeFlowCategories
  saveRaw(data)
}

export function getAutoReviewRules(): AutoReviewRule[] {
  return loadRaw().autoReviewRules
}

export function saveAutoReviewRules(autoReviewRules: AutoReviewRule[]) {
  const data = loadRaw()
  data.autoReviewRules = autoReviewRules
  saveRaw(data)
}

/** 创建 ID */
function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}
