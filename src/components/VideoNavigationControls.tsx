import { MdSkipNext, MdSkipPrevious, MdSpaceBar } from "react-icons/md";

interface VideoNavigationControlsProps {
  isPlaying: boolean
  onNext: () => void
  onPrev: () => void
  togglePlay: () => void
  realDuration: number
  virtualDuration: number
}

const formatTime = (s: number) => {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

export const VideoNavigationControls = ({
  isPlaying,
  onNext,
  onPrev,
  togglePlay,
  realDuration,
  virtualDuration
}: VideoNavigationControlsProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mt-2 w-full max-w-4xl">
      {/* Botones de Navegación */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            className="cursor-pointer p-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg shadow-sm transition-all group active:scale-95"
          >
            <MdSkipPrevious size={28} className="text-neutral-700 group-hover:text-indigo-600" />
          </button>

          <button
            onClick={togglePlay}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg text-white shadow-lg shadow-indigo-200/20"
          >
            <MdSpaceBar size={20} className="text-indigo-400" />
            <span className="text-xs font-semibold tracking-wide">
              {isPlaying ? "PAUSA" : " PLAY"}
            </span>
          </button>

          <button
            onClick={onNext}
            className="cursor-pointer p-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg shadow-sm transition-all group active:scale-95"
          >
            <MdSkipNext size={28} className="text-neutral-700 group-hover:text-indigo-600" />
          </button>
        </div>
        <p className="text-[11px] text-neutral-400 font-medium italic">
          También puedes navegar usando las flechas del teclado y la barra espaciadora.
        </p>
      </div>

      {/* Leyenda de Tiempos */}
      <div className="flex gap-6 text-sm font-medium text-neutral-500 bg-white px-4 py-2 rounded-full shadow-sm border border-neutral-100">
        <div className="flex flex-col items-center border-r border-neutral-200 pr-6">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">Duración Real</span>
          <span className="text-neutral-700">{formatTime(realDuration)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider text-indigo-400">Contenido Útil (Virtual)</span>
          <span className="text-indigo-600 font-bold">{formatTime(virtualDuration)}</span>
        </div>
      </div>
    </div>
  );
};