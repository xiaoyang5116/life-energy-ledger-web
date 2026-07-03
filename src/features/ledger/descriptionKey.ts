export function toDescriptionKey(description: string) {
  return description
    .trim() // 去掉首尾空白
    .toLowerCase() // 转小写
    .replace(/\s+/g, " ") // 连续空白压缩成一个空格
}
