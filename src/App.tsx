import { VideoPlayer } from "./components/VideoPlayer"
import { tags } from "./data/videoData"
// import video from "./assets/videos/video.mp4"

const urlVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          <span className="text-indigo-600">Video Player</span> con Etiquetas
        </h1>
      </header>

      <main className="w-full flex justify-center mb-10">

        <VideoPlayer src={urlVideo} tags={tags} />
      </main>

      <footer>
        <p className="text-neutral-500 mt-2 font-medium">By Kevin Espinoza</p>
      </footer>
    </div>
  );
}

export default App
