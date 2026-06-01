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

export const Route = createFileRoute("/_tabs/setting")({
  component: RouteComponent,
})

type SettingsFormValues = {
  monthlyAfterTaxIncome: string
  monthlyCommuteCost: string
  workHoursPerDay: string
  workDaysPerMonth: string
  commuteHoursPerDay: string
}

const settingsStorageKey = "fire-tracker:user-settings"

const defaultFormValues: SettingsFormValues = {
  monthlyAfterTaxIncome: "",
  monthlyCommuteCost: "",
  workHoursPerDay: "",
  workDaysPerMonth: "",
  commuteHoursPerDay: "",
}

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

function toStoredInputValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return typeof value === "string" ? value : ""
}

function parseNonNegativeNumber(value: string) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? Math.max(parsedValue, 0) : 0
}

function RouteComponent() {
  const [formValues, setFormValues] =
    useState<SettingsFormValues>(readStoredSettings)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const realHourlyWage = useMemo(() => {
    const monthlyAfterTaxIncome = parseNonNegativeNumber(
      formValues.monthlyAfterTaxIncome
    )
    const monthlyCommuteCost = parseNonNegativeNumber(
      formValues.monthlyCommuteCost
    )
    const workHoursPerDay = parseNonNegativeNumber(formValues.workHoursPerDay)
    const workDaysPerMonth = parseNonNegativeNumber(formValues.workDaysPerMonth)
    const commuteHoursPerDay = parseNonNegativeNumber(
      formValues.commuteHoursPerDay
    )

    const monthlyWorkHours = workHoursPerDay * workDaysPerMonth
    const monthlyCommuteHours = commuteHoursPerDay * workDaysPerMonth
    const availableIncome = monthlyAfterTaxIncome - monthlyCommuteCost
    const totalWorkRelatedHours = monthlyWorkHours + monthlyCommuteHours

    if (availableIncome <= 0 || totalWorkRelatedHours <= 0) {
      return null
    }

    return availableIncome / totalWorkRelatedHours
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
    window.localStorage.setItem(settingsStorageKey, JSON.stringify(formValues))
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
              <Field>
                <FieldLabel htmlFor="monthlyAfterTaxIncome">
                  税后月工资
                </FieldLabel>
                <Input
                  id="monthlyAfterTaxIncome"
                  inputMode="decimal"
                  min="0"
                  placeholder="例如 15000"
                  type="number"
                  value={formValues.monthlyAfterTaxIncome}
                  onChange={(event) =>
                    updateFormValue("monthlyAfterTaxIncome", event.target.value)
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="monthlyCommuteCost">月通勤成本</FieldLabel>
                <Input
                  id="monthlyCommuteCost"
                  inputMode="decimal"
                  min="0"
                  placeholder="例如 600"
                  type="number"
                  value={formValues.monthlyCommuteCost}
                  onChange={(event) =>
                    updateFormValue("monthlyCommuteCost", event.target.value)
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="workHoursPerDay">每日工作小时</FieldLabel>
                <Input
                  id="workHoursPerDay"
                  inputMode="decimal"
                  min="0"
                  placeholder="例如 8"
                  step="0.5"
                  type="number"
                  value={formValues.workHoursPerDay}
                  onChange={(event) =>
                    updateFormValue("workHoursPerDay", event.target.value)
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="workDaysPerMonth">每月工作天数</FieldLabel>
                <Input
                  id="workDaysPerMonth"
                  inputMode="decimal"
                  min="0"
                  placeholder="例如 22"
                  step="1"
                  type="number"
                  value={formValues.workDaysPerMonth}
                  onChange={(event) =>
                    updateFormValue("workDaysPerMonth", event.target.value)
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="commuteHoursPerDay">
                  每日通勤小时
                </FieldLabel>
                <Input
                  id="commuteHoursPerDay"
                  inputMode="decimal"
                  min="0"
                  placeholder="例如 1.5"
                  step="0.5"
                  type="number"
                  value={formValues.commuteHoursPerDay}
                  onChange={(event) =>
                    updateFormValue("commuteHoursPerDay", event.target.value)
                  }
                />
              </Field>

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
