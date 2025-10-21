import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronDown, Settings } from "lucide-react";
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
  const [selectedQuality, setSelectedQuality] = useState<string>("720p");

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
    // Auto-refresh episode data every 5 minutes to check for new episodes
    const interval = setInterval(loadEpisodeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
          <div className="w-full h-full overflow-hidden relative">
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
              style={{ 
                border: 'none',
                display: 'block',
                pointerEvents: 'auto',
                overflow: 'hidden'
              }}
              title={`${animeTitle} Episode ${episode}`}
              referrerPolicy="no-referrer"
              scrolling="no"
            />
            {/* Overlay to block ads and prevent scrolling */}
            <div className="absolute inset-0 pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <p>Video tidak tersedia</p>
          </div>
        )}
      </div>

      {/* Download & Resolution Section */}
      {videoSources.length > 0 && (
        <div className="glass-effect rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold">Download Episode {episode}</h3>
              <p className="text-sm text-muted-foreground">Pilih kualitas dan resolusi</p>
            </div>
            <div className="flex gap-2">
              {/* Resolution Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-primary/40 hover:bg-primary/10 hover:border-primary"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {selectedQuality}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 z-50 bg-background">
                  {videoSources.map((source, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        setSelectedQuality(source.quality);
                        toast({
                          title: "Resolusi Diubah",
                          description: `Beralih ke kualitas ${source.quality}`,
                        });
                      }}
                      className={`cursor-pointer ${
                        selectedQuality === source.quality ? 'bg-primary/20' : ''
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {source.quality}
                      {selectedQuality === source.quality && " ✓"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Download Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-primary/40 hover:bg-primary/10 hover:border-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50 bg-background">
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
                      {source.quality}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
