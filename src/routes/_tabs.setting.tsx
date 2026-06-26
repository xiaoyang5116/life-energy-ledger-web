import { type SubmitEvent, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  calculateRealHourlyWage,
  toRealHourlyWageInput,
  type SettingsFormValues,
} from "@/features/settings/hourly-wage"

export const Route = createFileRoute("/_tabs/setting")({
  component: RouteComponent,
})

const settingsStorageKey = "fire-tracker:user-settings"

const defaultFormValues: SettingsFormValues = {
  monthlyAfterTaxIncome: "",
  monthlyCommuteCost: "",
  workHoursPerDay: "",
  workDaysPerMonth: "",
  commuteHoursPerDay: "",
}

/**
 * 读取存储的用户设置。
 * - 如果浏览器不可用，则返回默认值。
 * - 如果存储的用户设置不存在，则返回默认值。
 * - 如果解析用户设置失败，则返回默认值。
 * - 否则返回解析后的用户设置。
 */
function readStoredSettings(): SettingsFormValues {
  if (typeof window === "undefined") {
    return defaultFormValues
  }

  const rawSettings = window.localStorage.getItem(settingsStorageKey)

  if (!rawSettings) {
    return defaultFormValues
  }

  try {
    const parsedSettings = JSON.parse(rawSettings) as Partial<
      Record<keyof SettingsFormValues, unknown>
    >

    return {
      monthlyAfterTaxIncome: toStoredInputValue(
        parsedSettings.monthlyAfterTaxIncome
      ),
      monthlyCommuteCost: toStoredInputValue(parsedSettings.monthlyCommuteCost),
      workHoursPerDay: toStoredInputValue(parsedSettings.workHoursPerDay),
      workDaysPerMonth: toStoredInputValue(parsedSettings.workDaysPerMonth),
      commuteHoursPerDay: toStoredInputValue(parsedSettings.commuteHoursPerDay),
    }
  } catch {
    return defaultFormValues
  }
}

function writeStoredSettings(formValues: SettingsFormValues) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(settingsStorageKey, JSON.stringify(formValues))
}

/**
 * 将值转换为存储的输入值。
 * - 如果值是有限数字，则转换为字符串。
 * - 如果值是字符串，则直接返回。
 * - 否则返回空字符串。
 */
function toStoredInputValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return typeof value === "string" ? value : ""
}

const settingFields = [
  {
    key: "monthlyAfterTaxIncome" as const,
    label: "税后月工资",
    placeholder: "例如 15000",
  },
  {
    key: "monthlyCommuteCost" as const,
    label: "月通勤成本",
    placeholder: "例如 600",
  },
  {
    key: "workHoursPerDay" as const,
    label: "每日工作小时",
    placeholder: "例如 8",
    step: "0.5",
  },
  {
    key: "workDaysPerMonth" as const,
    label: "每月工作天数",
    placeholder: "例如 22",
    step: "1",
  },
  {
    key: "commuteHoursPerDay" as const,
    label: "每日通勤小时",
    placeholder: "例如 1.5",
    step: "0.5",
  },
]

function RouteComponent() {
  const [formValues, setFormValues] =
    useState<SettingsFormValues>(readStoredSettings)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const realHourlyWage = useMemo(() => {
    const input = toRealHourlyWageInput(formValues)
    return calculateRealHourlyWage(input)
  }, [formValues])

  function updateFormValue(field: keyof SettingsFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
    setSavedAt(null)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    writeStoredSettings(formValues)
    setSavedAt(new Date().toLocaleTimeString("zh-CN", { hour12: false }))
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">设置</h1>
        <p className="text-sm text-muted-foreground">
          配置真实时薪参数，让每笔金额换算成更贴近生活的生命能量。
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>真实时薪</CardTitle>
            <CardDescription>
              系统会把通勤成本和通勤时间一起纳入计算。
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              {settingFields.map((field) => (
                <Field key={field.key}>
                  <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                  <Input
                    id={field.key}
                    inputMode="decimal"
                    min="0"
                    placeholder={field.placeholder}
                    step={"step" in field ? field.step : undefined}
                    type="number"
                    value={formValues[field.key]}
                    onChange={(event) =>
                      updateFormValue(field.key, event.target.value)
                    }
                  />
                </Field>
              ))}

              <Field>
                <FieldLabel>当前真实时薪</FieldLabel>
                <div className="rounded-lg border bg-muted px-3 py-2">
                  <div className="text-2xl font-semibold">
                    {realHourlyWage === null
                      ? "待计算"
                      : `${realHourlyWage.toFixed(2)} 元/小时`}
                  </div>
                  <FieldDescription className="mt-1">
                    公式：(税后月工资 - 月通勤成本) / (月工作时间 + 月通勤时间)
                  </FieldDescription>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="justify-between">
            <p className="text-sm text-muted-foreground">
              {savedAt ? `已保存于 ${savedAt}` : "修改后请保存设置"}
            </p>
            <Button type="submit">
              <Save data-icon="inline-start" />
              保存
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
