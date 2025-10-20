import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  animeTitle: string;
  episode: number;
}

interface VideoSource {
  quality: string;
  url: string;
}

const VideoPlayer = ({ animeTitle, episode }: VideoPlayerProps) => {
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);

  // Create Kuronime-style slug from anime title
  const createKuronimeSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  useEffect(() => {
    loadEpisodeData();
  }, [animeTitle, episode]);

  const loadEpisodeData = async () => {
    try {
      setLoading(true);
      
      // Create Kuronime URL format: nonton-{title}-episode-{number}
      const slug = createKuronimeSlug(animeTitle);
      const kuronimeUrl = `https://kuronime.moe/nonton-${slug}-episode-${episode}`;
      
      // Set iframe URL directly to Kuronime page
      setStreamUrl(kuronimeUrl);
      
      // Mock download links (Kuronime doesn't provide direct API)
      setVideoSources([
        { quality: "360p", url: kuronimeUrl },
        { quality: "480p", url: kuronimeUrl },
        { quality: "720p", url: kuronimeUrl },
        { quality: "1080p", url: kuronimeUrl }
      ]);
      
    } catch (error) {
      console.error('Error loading episode:', error);
      toast({
        title: "Error",
        description: "Gagal memuat video. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="w-full">
        <div className="aspect-video bg-black rounded-lg overflow-hidden card-shadow mb-4 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video bg-black rounded-lg overflow-hidden card-shadow mb-4 relative">
        {streamUrl ? (
          <iframe
            src={streamUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ border: 'none' }}
            title={`${animeTitle} Episode ${episode}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <p>Video tidak tersedia</p>
          </div>
        )}
      </div>

      {/* Quality and Download Controls */}
      {videoSources.length > 0 && (
        <div className="glass-effect rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3">Download Episode {episode}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {videoSources.map((source, index) => (
              <Button
                key={index}
                onClick={() => {
                  toast({
                    title: "Download Dimulai",
                    description: `Mengunduh ${animeTitle} Episode ${episode} - ${source.quality}`,
                  });
                  window.open(source.url, '_blank');
                }}
                variant="outline"
                className="border-primary/40 hover:bg-primary/10 hover:border-primary"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {source.quality}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
