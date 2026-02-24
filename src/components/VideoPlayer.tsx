import { useCallback } from "react"
import { VideoControls } from "./VideoControls"
import { VideoTimeline } from "./VideoTimeline"

import { VideoNavigationControls } from "./VideoNavigationControls"
import type { Tag } from "../types"
import { useVideoLogic } from "../hooks/useVideoLogic"
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"

interface VideoPlayerProps {
  src: string
  tags: Tag[]
}

export const VideoPlayer = ({ src, tags }: VideoPlayerProps) => {

  const { videoRef, state, actions } = useVideoLogic(tags)

  // Controlar volumen 
  const handleVolumeChange = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    actions.setVolume(value)
  }, [])

  // Controlar velocidad (playbackRate)
  const handlePlaybackRateChange = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate
    actions.setPlaybackRate(rate)
  }, [])

  // Fullscreen
  const toggleFullScreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen()
      actions.setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      actions.setIsFullScreen(false)
    }
  }, [state.isFullScreen])

  const handleNextSegment = () => {
    // Buscamos el primer punto de interés mayor al progreso virtual actual
    const nextPoint = state.snapPoints.find(p => p > state.progress + 0.1); // +0.1 para evitar bucles en el mismo punto
    if (nextPoint !== undefined) {
      actions.handleSeek(nextPoint);
    }
  }

  const handlePrevSegment = () => {
    // Buscamos el último punto de interés menor al progreso virtual actual
    const prevPoints = state.snapPoints.filter(p => p < state.progress - 0.1);
    if (prevPoints.length > 0) {
      actions.handleSeek(prevPoints[prevPoints.length - 1]);
    }
  }

  useKeyboardNavigation({
    onSpace: actions.togglePlay,
    onArrowRight: handleNextSegment,
    onArrowLeft: handlePrevSegment
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="relative border shadow-md shadow-black/50 rounded-md overflow-hidden w-225 h-125 drop-shadow-sm group">
        {/* Overlay de etiquetas activas */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-none">
          {state.activeTags.map((tag) => (
            <div
              key={tag.id}
              className="px-3 py-1.5 rounded-md text-white text-xs font-bold shadow-lg transform transition-all duration-300 animate-in fade-in slide-in-from-left-4"
              style={{ 
                backgroundColor: tag.color,
                borderLeft: '4px solid rgba(255,255,255,0.4)' 
              }}
            >
              {tag.label.toUpperCase()}
            </div>
          ))}
        </div>

        <video
          className="w-full h-full object-cover"
          ref={videoRef}
          src={src}
          onClick={actions.togglePlay}
          onPlay={() => actions.setIsPlaying(true)}
          onPause={() => actions.setIsPlaying(false)}
          onWaiting={() => actions.setIsBuffering(true)}
          onPlaying={() => actions.setIsBuffering(false)}
        ></video>
        {/* Mostrar Spinner */}
        {state.isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <VideoControls
          // Estados
          progress={state.progress}
          duration={state.virtualDuration}
          isPlaying={state.isPlaying}
          volume={state.volume}
          playbackRate={state.playbackRate}
          isFullScreen={state.isFullScreen}

          // Funciones del reproductor
          togglePlay={actions.togglePlay}
          onSeek={actions.handleSeek}
          onVolumeChange={handleVolumeChange}
          onPlaybackRateChange={handlePlaybackRateChange}
          onToggleFullScreen={toggleFullScreen}
        />
      </div>

      <VideoTimeline
        tags={tags}
        duration={state.virtualDuration}
        currentTime={state.progress}
      />

      <VideoNavigationControls
        isPlaying={state.isPlaying}
        onNext={handleNextSegment}
        onPrev={handlePrevSegment}
        togglePlay={actions.togglePlay}
        realDuration={state.duration}
        virtualDuration={state.virtualDuration}
      />
    </div>
  )
}

