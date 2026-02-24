import type { Tag, TimelineTrack } from "../types"

const isOverlapping = (a: Tag, b: Tag) => {
  return a.start < b.end && a.end > b.start
}

export const buildTimelineTracks = (tags: Tag[]): TimelineTrack[] => {
  const sorted = [...tags].sort((a, b) => a.start - b.start)

  const tracks: TimelineTrack[] = []

  for (const tag of sorted) {
    let placed = false

    for (const track of tracks) {
      const hasCollision = track.tags.some(existing =>
        isOverlapping(existing, tag)
      )

      if (!hasCollision) {
        track.tags.push(tag)
        placed = true
        break
      }
    }

    if (!placed) {
      tracks.push({
        trackIndex: tracks.length,
        tags: [tag]
      })
    }
  }

  return tracks
}