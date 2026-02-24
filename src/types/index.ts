export type Cut = {
  start: number
  end: number
}

export type Tag = {
  id: string
  label: string
  start: number
  end: number
  color: string
}

export interface VideoPlayerProps {
  src: string
  cuts?: Cut[]
}

export interface TimelineTrack {
  trackIndex: number
  tags: Tag[]
}