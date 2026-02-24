import type { Tag } from "../types"
import { buildTimelineTracks } from "../utils/buildTimelineTracks"

type VideoTimelineProps = {
  tags: Tag[]
  duration: number
  currentTime: number
}

export const VideoTimeline = ({
  tags,
  duration,
  currentTime
}: VideoTimelineProps) => {

  const tracks = buildTimelineTracks(tags)

  return (
    <div className="w-full bg-neutral-900 rounded-md p-4">
      <div className="relative ">

        {/* Línea vertical de tiempo actual */}
        <div
          className="absolute -top-1.5 -bottom-2 w-0.5 bg-red-500 z-50"
          style={{
            left: `${(currentTime / duration) * 100}%`
          }}
        />

        {/* Tracks/Pistas */}
        <div className="flex flex-col gap-2">
          {tracks.map(track => (
            <div key={track.trackIndex} className="relative h-8 bg-neutral-700 rounded">

              {track.tags.map(tag => {
                const left = (tag.start / duration) * 100
                const width = ((tag.end - tag.start) / duration) * 100

                return (
                  <div
                    key={tag.id}
                    className="absolute h-full rounded text-xs text-white flex items-center px-2"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: tag.color || "#3b82f6"
                    }}
                  >
                    {tag.label}
                  </div>
                )
              })}

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}