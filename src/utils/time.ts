import type { Tag } from "../types";

export interface TimeSegment {
    start: number;
    end: number;
    virtualStart: number; // Dónde empieza este segmento en la línea de tiempo del usuario
}

/**
 * Une los tags solapados para crear bloques continuos de "tiempo real" que se mostrarán.
 */
export const getValidSegments = (tags: Tag[]): TimeSegment[] => {
    if (tags.length === 0) return [];

    // Ordenar por inicio
    const sorted = [...tags].sort((a, b) => a.start - b.start);

    // Fusionar intervalos solapados
    const merged: { start: number, end: number }[] = [];
    let current = { start: sorted[0].start, end: sorted[0].end };

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].start <= current.end) {
            current.end = Math.max(current.end, sorted[i].end);
        } else {
            merged.push(current);
            current = { start: sorted[i].start, end: sorted[i].end };
        }
    }
    merged.push(current);

    // Calcular el inicio virtual de cada segmento
    let cumulativeVirtualTime = 0;
    return merged.map(seg => {
        const segment = { ...seg, virtualStart: cumulativeVirtualTime };
        cumulativeVirtualTime += (seg.end - seg.start);
        return segment;
    });
};

/**
 * Pasa de tiempo del video (real) a tiempo del reproductor (virtual)
 */
export const realToVirtual = (realTime: number, segments: TimeSegment[]): number => {
    const segment = segments.find(s => realTime >= s.start && realTime <= s.end);
    if (!segment) {
        // Si estamos en un "hueco", buscamos el segmento anterior más cercano
        const prevSegment = [...segments].reverse().find(s => realTime >= s.end);
        return prevSegment ? prevSegment.virtualStart + (prevSegment.end - prevSegment.start) : 0;
    }
    return segment.virtualStart + (realTime - segment.start);
};

/**
 * Pasa de tiempo del reproductor (virtual) a tiempo del video (real)
 * Útil para el "onSeek" de la barra de progreso
 */
export const virtualToReal = (virtualTime: number, segments: TimeSegment[]): number => {
    const segment = segments.find(s =>
        virtualTime >= s.virtualStart &&
        virtualTime <= s.virtualStart + (s.end - s.start)
    );
    if (!segment) return 0;
    return segment.start + (virtualTime - segment.virtualStart);
};