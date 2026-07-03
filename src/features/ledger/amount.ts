/**
 * 追加金额键
 * 只允许一个小数点，
 * 小数最多 2 位
 */
export function appendAmountKey(current: string, key: string) {
  switch (key) {
    case ".":
      if (current === "" || current === "0") {
        return "0."
      }
      if (current.includes(".")) {
        return current
      }
      return current + key
    default:
      if (current === "" || current === "0") {
        return key === "0" ? current : key
      }
      if (current.split(".")[1]?.length === 2) {
        return current
      }
      return current + key
  }
}

/**
 * 删除金额键
 * @param current 当前金额
 * @returns 删除后的金额
 */
export function deleteAmountKey(current: string) {
  return current.slice(0, -1)
}
