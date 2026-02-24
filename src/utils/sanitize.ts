import type { Cut, Tag } from "../types"

export const sanitizeRealTime = (
  time: number,
  cuts: Cut[]
): number => {
  for (const cut of cuts) {
    if (time >= cut.start && time < cut.end) {
      return cut.end
    }
  }
  return time
}

export const validateTags = (
  tags: Tag[],
  duration: number
): boolean => {
  return tags.every(tag =>
    tag.start >= 0 &&
    tag.end <= duration &&
    tag.start < tag.end
  )
}