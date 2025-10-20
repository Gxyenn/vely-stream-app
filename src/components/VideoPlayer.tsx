import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchEpisodeStream, VideoSource } from "@/services/animeApi";

interface VideoPlayerProps {
  episodeSlug: string;
  animeTitle: string;
  episode: number;
}

const VideoPlayer = ({ episodeSlug, animeTitle, episode }: VideoPlayerProps) => {
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [showQualities, setShowQualities] = useState(false);
  const [streamData, setStreamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);

  useEffect(() => {
    loadEpisodeData();
  }, [episodeSlug]);

  const loadEpisodeData = async () => {
    try {
      setLoading(true);
      const data = await fetchEpisodeStream(episodeSlug);
      
      if (data) {
        setStreamData(data);
        setVideoSources(data.download_links || []);
      }
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

  const handleDownload = (quality: string) => {
    const source = videoSources.find(s => s.quality === quality);
    
    if (source) {
      toast({
        title: "Download Dimulai",
        description: `Mengunduh ${animeTitle} Episode ${episode} - ${quality}`,
      });
      window.open(source.url, '_blank');
    } else {
      toast({
        title: "Tidak Tersedia",
        description: `Kualitas ${quality} tidak tersedia untuk episode ini`,
        variant: "destructive",
      });
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

  const streamUrl = streamData?.iframe_url || streamData?.stream_url;

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
