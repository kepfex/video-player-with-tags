import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { VideoControls } from "./VideoControls"
import { VideoTimeline } from "./VideoTimeline"

import { VideoNavigationControls } from "./VideoNavigationControls"
import type { Tag } from "../types"
import { getValidSegments, realToVirtual, virtualToReal } from "../utils/time"

interface VideoPlayerProps {
  src: string
  tags: Tag[]
}

export const VideoPlayer = ({ src, tags }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)

  const segments = useMemo(() => getValidSegments(tags), [tags]);
  const virtualDuration = useMemo(() =>
    segments.reduce((acc, s) => acc + (s.end - s.start), 0),
    [segments]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return

    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (!video) return;

      const realTime = video.currentTime;

      // Regla del Dominio: Saltar secciones ocultas
      const currentSegment = segments.find(s => realTime >= s.start && realTime <= s.end);
      if (!currentSegment) {
        const nextSegment = segments.find(s => s.start > realTime);
        if (nextSegment) {
          video.currentTime = nextSegment.start;
          return;
        } else {
          video.pause();
        }
      }

      // Actualizar el progreso virtual para la UI
      const vTime = realToVirtual(realTime, segments);
      setProgress(vTime); // Ahora 'progress' es virtual
    };

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
  const handleSeek = useCallback((vTime: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Convertimos el click de la barra (virtual) a lo que el video entiende (real)
    const rTime = virtualToReal(vTime, segments);
    video.currentTime = rTime;
    setProgress(vTime);
  }, [segments]);

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

  // Obtener cortes desde los tags
  const cuts = tags.map(tag => ({
    start: tag.start,
    end: tag.end
  })).sort((a, b) => a.start - b.start)

  const snapPoints = useMemo(() => {
    const points = new Set<number>();
    points.add(0); // Inicio total
    points.add(virtualDuration); // Fin total

    segments.forEach(seg => {
      // Los bordes de los segmentos válidos son puntos clave
      points.add(seg.virtualStart);
      points.add(seg.virtualStart + (seg.end - seg.start));
    });

    // Convertimos los puntos de los tags a virtual y los agregamos
    tags.forEach(tag => {
      points.add(realToVirtual(tag.start, segments));
      points.add(realToVirtual(tag.end, segments));
    });

    return Array.from(points).sort((a, b) => a - b);
  }, [segments, tags, virtualDuration]);


  const goToNextSegment = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    // Buscamos el primer punto de interés mayor al progreso virtual actual
    const nextPoint = snapPoints.find(p => p > progress + 0.1);
    if (nextPoint !== undefined) handleSeek(nextPoint);
  }, [snapPoints, progress, handleSeek])

  const goToPrevSegment = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    // Buscamos el último punto de interés menor al progreso virtual actual
    const prevPoints = snapPoints.filter(p => p < progress - 0.1);
    if (prevPoints.length > 0) {
      handleSeek(prevPoints[prevPoints.length - 1]);
    }
  }, [snapPoints, progress, handleSeek])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar que la barra espaciadora haga scroll en la página
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }

      if (e.code === "ArrowRight") {
        e.preventDefault();
        // Buscar el primer punto mayor al tiempo actual
        const nextPoint = snapPoints.find(p => p > progress + 0.1); // +0.1 para evitar bucles en el mismo punto
        if (nextPoint !== undefined) {
          handleSeek(nextPoint);
        }
      }

      if (e.code === "ArrowLeft") {
        e.preventDefault();
        // Buscar el último punto menor al tiempo actual
        const prevPoints = snapPoints.filter(p => p < progress - 0.1);
        if (prevPoints.length > 0) {
          const lastPrevPoint = prevPoints[prevPoints.length - 1];
          handleSeek(lastPrevPoint);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [progress, snapPoints, togglePlay, handleSeek]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative border shadow-md shadow-black/50 rounded-md overflow-hidden w-225 h-125 drop-shadow-sm group">
        <video
          className="w-full h-full object-cover"
          ref={videoRef}
          src={src}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
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
          duration={virtualDuration}
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
      <VideoTimeline
        tags={tags}
        duration={virtualDuration}
        currentTime={progress}
      />

      <VideoNavigationControls
        isPlaying={isPlaying}
        onNext={goToNextSegment}
        onPrev={goToPrevSegment}
        togglePlay={togglePlay}
        realDuration={duration}
        virtualDuration={virtualDuration}
      />
    </div>
  )
}

