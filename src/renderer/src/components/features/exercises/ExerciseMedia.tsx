import { Camera, Video } from 'lucide-react'

interface ExerciseMediaProps {
  name: string
  videoSrc?: string
  cameraGuidance?: string
}

export default function ExerciseMedia({
  name,
  videoSrc,
  cameraGuidance
}: ExerciseMediaProps): React.JSX.Element {
  return (
    <section aria-label={`${name} demonstration`}>
      <div className="relative flex aspect-video max-h-150 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-accent-surface">
        {videoSrc ? (
          <video
            key={videoSrc}
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
            aria-label={`${name} demonstration video`}
            className="h-full w-full object-contain"
          >
            Your browser does not support video playback.
          </video>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <Video className="h-10 w-10 text-accent-foreground" aria-hidden="true" />
            <p className="text-sm text-text-secondary">Video not available yet.</p>
          </div>
        )}
      </div>
      {cameraGuidance && (
        <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-text-secondary">
          <Camera className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{cameraGuidance}</p>
        </div>
      )}
    </section>
  )
}
