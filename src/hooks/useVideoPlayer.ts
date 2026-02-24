import { useEffect, useRef, useState } from "react"
import type { Cut } from "../types"
import { sanitizeRealTime } from "../utils/sanitize"

export const useVideoPlayer = (cuts: Cut[] = []) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const safeTime = sanitizeRealTime(video.currentTime, cuts)

      if (safeTime !== video.currentTime) {
        video.currentTime = safeTime
      }

      setProgress(safeTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [cuts])

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    progress,
    duration
  }
}