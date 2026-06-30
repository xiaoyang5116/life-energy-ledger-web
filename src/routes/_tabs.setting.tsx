import { type SubmitEvent, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Save } from "lucide-react"
import { toast } from "sonner"

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
  areFormFieldsEqual,
  calculateRealHourlyWage,
  calculateRealHourlyWageFormDefaultValues,
  toCalculateRealHourlyWageArgs,
  toCalculateRealHourlyWageFormFields,
  type TCalculateRealHourlyWageFormFields,
} from "@/features/settings/hourly-wage"
import {
  useSaveUserSettings,
  useUserSettings,
} from "@/features/settings/queries"
import type { UserSettings } from "@/features/ledger/model"

export const Route = createFileRoute("/_tabs/setting")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: userSettings, isLoading } = useUserSettings()

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">加载中…</div>
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">设置</h1>
        <p className="text-sm text-muted-foreground">
          配置真实时薪参数，让每笔金额换算成更贴近生活的生命能量。
        </p>
      </header>

      <SettingRealHourlyWageForm
        key={userSettings?.updatedAt ?? "new"}
        userSettings={userSettings ?? null}
      />
    </div>
  )
}

const settingFields = [
  {
    key: "monthlyAfterTaxIncome",
    label: "税后月工资",
    placeholder: "例如 15000",
    step: "0.01",
  },
  {
    key: "monthlyCommuteCost",
    label: "月通勤成本",
    placeholder: "例如 600",
    step: "0.01",
  },
  {
    key: "workHoursPerDay",
    label: "每日工作小时",
    placeholder: "例如 8",
    step: "0.5",
  },
  {
    key: "workDaysPerMonth",
    label: "每月工作天数",
    placeholder: "例如 22",
    step: "1",
  },
  {
    key: "commuteHoursPerDay",
    label: "每日通勤小时",
    placeholder: "例如 1.5",
    step: "0.5",
  },
] satisfies ReadonlyArray<{
  key: keyof TCalculateRealHourlyWageFormFields
  label: string
  placeholder: string
  step: string
}>

function SettingRealHourlyWageForm({
  userSettings,
}: {
  userSettings: UserSettings | null
}) {
  const savedFormValues = useMemo(
    () =>
      userSettings
        ? toCalculateRealHourlyWageFormFields(userSettings)
        : calculateRealHourlyWageFormDefaultValues,
    [userSettings]
  )

  // 用户正在编辑的草稿，是这里唯一需要的本地 state。
  // 组件挂载时以已保存值为初值；保存成功后由父组件的 key 触发重建来重置草稿。
  const [formValues, setFormValues] = useState(savedFormValues)
  const { mutate: saveUserSettings } = useSaveUserSettings()

  const realHourlyWage = useMemo(() => {
    const input = toCalculateRealHourlyWageArgs(formValues)
    return calculateRealHourlyWage(input)
  }, [formValues])

  // 派生值：直接从已保存数据算出，无需额外 state 手动同步。
  const savedAt = userSettings?.updatedAt ?? null
  const isDirty = !areFormFieldsEqual(formValues, savedFormValues)

  function updateFormValue(
    field: keyof TCalculateRealHourlyWageFormFields,
    value: string
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = toCalculateRealHourlyWageArgs(formValues)

    if (realHourlyWage === null) {
      toast.error("请检查输入是否正确，计算结果为空", {
        position: "top-center",
      })
      return
    }

    saveUserSettings(
      {
        ...input,
        realHourlyWage: realHourlyWage,
      },
      {
        onSuccess: () => {
          toast.success("设置已保存", {
            position: "top-center",
          })
        },
        onError: (error) => {
          console.error(error)
          toast.error("设置保存失败", {
            position: "top-center",
          })
        },
      }
    )
  }

  return (
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
                  type="number"
                  step={field.step}
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
                <div className="text-2xl font-semibold" aria-live="polite">
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
            {isDirty
              ? "有未保存的修改"
              : savedAt
                ? `已保存于 ${new Date(savedAt).toLocaleString("zh-CN", { hour12: false })}`
                : "修改后请保存设置"}
          </p>
          <Button type="submit">
            <Save data-icon="inline-start" />
            保存
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
