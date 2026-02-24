import { VideoPlayer } from "./components/VideoPlayer"
import { tags } from "./data/videoData"
// import video from "./assets/videos/video.mp4"

const urlVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
function App() {

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <VideoPlayer
        src={urlVideo}
        tags={tags}
      />
    </div>
  )
}

export default App
