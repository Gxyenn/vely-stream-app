import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            style={{ border: 'none' }}
            title={`${animeTitle} Episode ${episode}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <p>Video tidak tersedia</p>
          </div>
        )}
      </div>

      {/* Download Dropdown */}
      {videoSources.length > 0 && (
        <div className="glass-effect rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Download Episode {episode}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10 hover:border-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pilih Kualitas
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {videoSources.map((source, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      toast({
                        title: "Download Dimulai",
                        description: `Mengunduh ${animeTitle} Episode ${episode} - ${source.quality}`,
                      });
                      window.open(source.url, '_blank');
                    }}
                    className="cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {source.quality}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
