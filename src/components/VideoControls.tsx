import { BsFillPlayFill, BsPauseFill } from "react-icons/bs"
import { MdFullscreen } from "react-icons/md"

const formatTime = (time: number) => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
};

type VideoControlsProps = {
  progress: number
  duration: number
  isPlaying: boolean
  volume: number
  playbackRate: number
  isFullScreen: boolean
  togglePlay: () => void
  onSeek: (time: number) => void
  onVolumeChange: (value: number) => void
  onPlaybackRateChange: (rate: number) => void
  onToggleFullScreen: () => void
}

export const VideoControls = ({
  progress,
  duration,
  isPlaying,
  togglePlay,
  volume,
  playbackRate,

  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onToggleFullScreen
}: VideoControlsProps) => {

  return (
    <div className={`absolute bottom-0 left-0 w-full p-4 flex items-center bg-black opacity-75
      ${isPlaying ? 'hidden group-hover:flex' : ''}
      `}
    >
      <div className="flex items-center justify-between gap-3 w-full">
        <button
          className="text-white focus:outline-none cursor-pointer"
          onClick={togglePlay}
        >
          {
            isPlaying ? <BsPauseFill size={24} /> : <BsFillPlayFill size={24} />
          }

        </button>

        <div className="flex items-center">
          <span className="text-white mr-2">
            {formatTime(progress)}
          </span>
          <div className="relative w-64 h-1.5 bg-gray-600 rounded-full mr-2">
            <input
              type="range"
              min={0}
              max={duration}
              step={1}
              value={progress}
              onChange={e => onSeek(Number(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-50"
            />
            <div
              className="absolute top-0 left-0 h-full bg-green-600 rounded-full"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            ></div>
          </div>
          <span className="text-white mr-2">
            {duration}
          </span>
        </div>
        <div className="flex items-center">
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="w-16 h-1.5 bg-gray-600 rounded-full mr-2 cursor-pointer"
          />
          <select
            value={playbackRate}
            onChange={e => onPlaybackRateChange(Number(e.target.value))}
            className="bg-black text-white px-2 py-2 rounded-md focus:outline-none cursor-pointer"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <button
          onClick={onToggleFullScreen}
          className="text-white focus:outline-none cursor-pointer"
        >
          <MdFullscreen size={24} />
        </button>
      </div>
    </div>
  )
}
