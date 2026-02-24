import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Tag } from "../types";
import { getValidSegments, realToVirtual, virtualToReal } from "../utils/time";

export const useVideoLogic = (tags: Tag[]) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Estados básicos
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0); // Real
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    // Lógica de Tiempo Virtual
    const segments = useMemo(() => getValidSegments(tags), [tags]);
    const virtualDuration = useMemo(() =>
        segments.reduce((acc, s) => acc + (s.end - s.start), 0),
        [segments]);

    // Snap Points para navegación
    const snapPoints = useMemo(() => {
        const points = new Set<number>([0, virtualDuration]);
        segments.forEach(seg => {
            points.add(seg.virtualStart);
            points.add(seg.virtualStart + (seg.end - seg.start));
        });
        tags.forEach(tag => {
            points.add(realToVirtual(tag.start, segments));
            points.add(realToVirtual(tag.end, segments));
        });
        return Array.from(points).sort((a, b) => a - b);
    }, [segments, tags, virtualDuration]);

    // Handlers de Control
    const togglePlay = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;
        video.paused ? await video.play() : video.pause();
        setIsPlaying(!video.paused);
    }, []);

    // Controlar el progreso (SEEK)
    const handleSeek = useCallback((vTime: number) => {
        const video = videoRef.current;
        if (!video) return;

        // Convertimos el click de la barra (virtual) a lo que el video entiende (real)
        const rTime = virtualToReal(vTime, segments);
        video.currentTime = rTime;
        setProgress(vTime);
    }, [segments]);

    // Sincronización con el Video Nativo
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
                    setIsPlaying(false)
                }
            }

            // Actualizar el progreso virtual para la UI
            const vTime = realToVirtual(realTime, segments);
            setProgress(vTime); // Ahora 'progress' es virtual
        };

        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('durationchange', () => setDuration(video.duration))

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate)
            video.removeEventListener("durationchange", () => setDuration(video.duration))
        }
    }, [segments])


    return {
        videoRef,
        state: {
            isPlaying,
            progress,
            duration,
            volume,
            playbackRate,
            isFullScreen,
            isBuffering,
            virtualDuration,
            snapPoints
        },
        actions: {
            togglePlay,
            handleSeek,
            setVolume,
            setPlaybackRate,
            setIsFullScreen,
            setIsPlaying,
            setIsBuffering
        }
    };
};