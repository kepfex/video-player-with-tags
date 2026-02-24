interface Props {
  onNext: () => void
  onPrev: () => void
}

export const VideoNavigationControls = ({ onNext, onPrev }: Props) => {
  return (
    <div className="flex gap-4">
      <button onClick={onPrev}>⏮ Anterior</button>
      <button onClick={onNext}>⏭ Siguiente</button>
    </div>
  )
}