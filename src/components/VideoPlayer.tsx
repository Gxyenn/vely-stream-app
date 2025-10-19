import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  animeTitle: string;
  episode: number;
  malId: number;
}

interface QualityOption {
  label: string;
  value: string;
}

const VideoPlayer = ({ animeTitle, episode, malId }: VideoPlayerProps) => {
  const [selectedQuality, setSelectedQuality] = useState("360p");
  const [showQualities, setShowQualities] = useState(false);

  // Convert anime title to slug format for Samehadaku
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const animeSlug = createSlug(animeTitle);
  
  // Quality options based on Samehadaku
  const qualityOptions: QualityOption[] = [
    { label: "360p", value: "360p" },
    { label: "480p", value: "480p" },
    { label: "720p", value: "720p" },
    { label: "1080p", value: "1080p" },
    { label: "MP4", value: "mp4" },
    { label: "MP4HD", value: "mp4hd" },
    { label: "FULLHD", value: "fullhd" },
  ];

  // Generate Samehadaku URL
  const videoUrl = `https://v1.samehadaku.how/${animeSlug}-episode-${episode}/`;

  const handleDownload = (quality: string) => {
    toast({
      title: "Download Dimulai",
      description: `Mengunduh ${animeTitle} Episode ${episode} - ${quality}`,
    });
    
    // Open download link in new tab
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="w-full">
      <div className="aspect-video bg-black rounded-lg overflow-hidden card-shadow mb-4 relative">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: 'none' }}
        />
      </div>

      {/* Quality and Download Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Button
            onClick={() => setShowQualities(!showQualities)}
            variant="outline"
            className="border-primary/40 hover:bg-primary/10"
          >
            Quality: {selectedQuality}
          </Button>
          
          {showQualities && (
            <div className="absolute top-full mt-2 z-50 glass-effect rounded-lg border border-primary/20 p-2 min-w-[150px]">
              <div className="grid grid-cols-2 gap-2">
                {qualityOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => {
                      setSelectedQuality(option.label);
                      setShowQualities(false);
                      handleDownload(option.label);
                    }}
                    variant={selectedQuality === option.label ? "default" : "ghost"}
                    className="text-sm h-8"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => handleDownload(selectedQuality)}
          className="gradient-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {selectedQuality}
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
