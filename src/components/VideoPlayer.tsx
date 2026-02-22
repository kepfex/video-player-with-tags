import { useCallback, useEffect, useRef, useState } from "react"
import { VideoControls } from "./VideoControls"

interface VideoPlayerProps {
  src: string
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return

    const handleTimeUpdate = () => setProgress(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
    }
  }, [])

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (video?.paused) {
      await video.play();
      setIsPlaying(true)
    } else {
      video?.pause()
      setIsPlaying(false)
    }
  }, [])

  // Controlar el progreso (SEEK)
  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return;

    video.currentTime = time
    setProgress(time)
  }, [])

  // Controlar volumen 
  const handleVolumeChange = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value)
  }, [])

  // Controlar velocidad (playbackRate)
  const handlePlaybackRateChange = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate
    setPlaybackRate(rate)
  }, [])

  // Fullscreen
  const toggleFullScreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen()
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }, [isFullScreen])
  return (
    <div className="relative border shadow-2xl shadow-black rounded-md overflow-hidden w-225 h-125 drop-shadow-sm group">
      <video
        className="w-full h-full object-cover"
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={e => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
      ></video>
      {/* Mostrar Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <VideoControls
        // Estados
        progress={progress}
        duration={duration}
        isPlaying={isPlaying}
        volume={volume}
        playbackRate={playbackRate}
        isFullScreen={isFullScreen}

        // Funciones del reproductor
        togglePlay={togglePlay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onPlaybackRateChange={handlePlaybackRateChange}
        onToggleFullScreen={toggleFullScreen}
      />
    </div>
  )
}

