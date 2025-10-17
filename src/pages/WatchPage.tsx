import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { saveWatchHistory } from "@/lib/localStorage";
import AnimeCard from "@/components/AnimeCard";

interface AnimeDetail {
  mal_id: number;
  title: string;
  episodes: number;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    embed_url: string;
  };
}

const WatchPage = () => {
  const { id, episode } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [recommendedAnime, setRecommendedAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentEp = parseInt(episode || "1");

  useEffect(() => {
    fetchAnimeDetail();
    fetchRecommendedAnime();
  }, [id]);

  useEffect(() => {
    // Save to watch history when episode changes
    if (anime && id) {
      saveWatchHistory({
        animeId: parseInt(id),
        animeTitle: anime.title,
        animeImage: anime.images?.jpg?.large_image_url || '',
        episode: currentEp,
      });
    }
  }, [anime, id, currentEp]);

  const fetchAnimeDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const data = await response.json();
      setAnime(data.data);
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedAnime = async () => {
    try {
      const response = await fetch(
        "https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12"
      );
      const data = await response.json();
      setRecommendedAnime(data.data || []);
    } catch (error) {
      console.error("Error fetching recommended anime:", error);
    }
  };

  const generateEpisodes = () => {
    // Ensure we use the correct episode count for this specific season/entry
    const episodeCount = anime?.episodes || 12; // Default to 12 if not available
    return Array.from({ length: episodeCount }, (_, i) => i + 1);
  };

  const handleEpisodeChange = (ep: number) => {
    navigate(`/watch/${id}/${ep}`);
  };

  const handleDownload = () => {
    // Video download functionality
    const downloadUrl = videoUrl;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${anime?.title}-episode-${currentEp}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Dimulai",
      description: `Mengunduh ${anime?.title} Episode ${currentEp}`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${anime?.title} - Episode ${currentEp}`,
      text: `Tonton ${anime?.title} Episode ${currentEp}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Dibagikan!",
          description: "Episode berhasil dibagikan",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Disalin!",
          description: "Link episode telah disalin ke clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Tidak dapat membagikan link",
        variant: "destructive",
      });
    }
  };

  const episodes = generateEpisodes();
  
  // Sankavollerei API integration (placeholder - requires anime slug)
  // Format: https://www.sankavollerei.com/anime/episode/{anime-slug}-episode-{episode}-sub-indo
  // For donghua: https://www.sankavollerei.com/anime/donghua/episode/{anime-slug}-episode-{episode}-subtitle-indonesia
  const videoUrl = anime?.trailer?.embed_url || `https://www.youtube.com/embed/${anime?.trailer?.youtube_id}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NavigationBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="aspect-video bg-secondary rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/anime/${id}`)}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Detail
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Video Player */}
          <div className="mb-6 animate-fade-in">
            <div className="aspect-video bg-black rounded-lg overflow-hidden card-shadow mb-4">
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Video Info */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{anime?.title}</h1>
                <p className="text-muted-foreground">Episode {currentEp}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Episode Navigation */}
          <div className="mb-6 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={() => handleEpisodeChange(currentEp - 1)}
                disabled={currentEp <= 1}
                variant="outline"
                className="border-primary/40 hover:bg-primary/10 shrink-0"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>

              <Button
                onClick={() => handleEpisodeChange(currentEp + 1)}
                disabled={!anime?.episodes || currentEp >= anime.episodes}
                variant="outline"
                className="border-primary/40 hover:bg-primary/10 shrink-0"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <ScrollArea className="w-full whitespace-nowrap rounded-lg border border-primary/20">
              <div className="flex gap-3 p-4">
                {episodes.map((ep) => (
                  <Button
                    key={ep}
                    onClick={() => handleEpisodeChange(ep)}
                    className={`min-w-[80px] h-12 transition-smooth shrink-0 ${
                      ep === currentEp
                        ? "gradient-primary glow-effect"
                        : "gradient-card hover:gradient-primary"
                    }`}
                  >
                    EP {ep}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Additional Info */}
          <div className="glass-effect rounded-lg p-6 animate-fade-in-up mb-8">
            <h3 className="text-xl font-bold mb-4">Informasi Episode</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Episode</p>
                <p className="font-medium">{anime?.episodes || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Episode Saat Ini</p>
                <p className="font-medium">Episode {currentEp}</p>
              </div>
            </div>
          </div>

          {/* Recommended Anime */}
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6">Anime Populer & Rekomendasi</h3>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <div className="flex gap-4 pb-4">
                {recommendedAnime.map((recAnime) => (
                  <div key={recAnime.mal_id} className="w-[200px] shrink-0">
                    <AnimeCard anime={recAnime} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WatchPage;
