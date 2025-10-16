import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Star, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";
import Header from "@/components/Header";
import { getWatchHistory, WatchHistory } from "@/lib/localStorage";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
  episodes: number;
  status: string;
  genres: Array<{ name: string }>;
}

const Home = () => {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [seasonal, setSeasonal] = useState<Anime[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnime();
    setWatchHistory(getWatchHistory());
  }, []);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      
      // Get current season
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      let season = 'winter';
      
      if (month >= 4 && month <= 6) season = 'spring';
      else if (month >= 7 && month <= 9) season = 'summer';
      else if (month >= 10 && month <= 12) season = 'fall';

      const [trendingRes, popularRes, seasonalRes] = await Promise.all([
        fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=12"),
        fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12"),
        fetch(`https://api.jikan.moe/v4/seasons/${year}/${season}?limit=12`),
      ]);

      const trendingData = await trendingRes.json();
      const popularData = await popularRes.json();
      const seasonalData = await seasonalRes.json();

      setTrending(trendingData.data || []);
      setPopular(popularData.data || []);
      setSeasonal(seasonalData.data || []);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              VelyStream
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Nonton Anime Sub Indo Gratis & Lengkap
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari anime favoritmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass-effect border-primary/20 focus:border-primary"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 gradient-primary"
              >
                Cari
              </Button>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Watch History Section */}
        {watchHistory.length > 0 && (
          <section className="mb-16 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Lanjutkan Menonton</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchHistory.slice(0, 6).map((item) => (
                <div
                  key={`${item.animeId}-${item.episode}`}
                  onClick={() => navigate(`/watch/${item.animeId}/${item.episode}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden card-shadow mb-2">
                    <img
                      src={item.animeImage}
                      alt={item.animeTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <Badge className="absolute bottom-2 right-2 bg-primary">
                      EP {item.episode}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-smooth">
                    {item.animeTitle}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seasonal Section */}
        <section className="mb-16 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Anime/Donghua Musim Ini</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-secondary rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {seasonal.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Anime */}
        <section className="mb-16 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-accent w-6 h-6" />
            <h2 className="text-3xl font-bold">Sedang Trending</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-secondary rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trending.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </section>

        {/* Popular Anime */}
        <section className="mb-16 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-primary w-6 h-6" />
            <h2 className="text-3xl font-bold">Paling Populer</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-secondary rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popular.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
