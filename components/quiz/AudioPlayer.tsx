import { Card } from "@/components/ui/card";

interface AudioPlayerProps {
  sources: string[];
}

export function AudioPlayer({ sources }: AudioPlayerProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <audio controls className="w-full">
        {sources.map((src) => (
          <source key={src} src={src} />
        ))}
        Your browser does not support the audio element.
      </audio>
    </Card>
  );
}
