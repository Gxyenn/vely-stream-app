import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimeCard from "@/components/AnimeCard";
import Header from "@/components/Header";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const [trendingRes, popularRes] = await Promise.all([
        fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=12"),
        fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12"),
      ]);

      const trendingData = await trendingRes.json();
      const popularData = await popularRes.json();

      setTrending(trendingData.data || []);
      setPopular(popularData.data || []);
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

      {/* Trending Anime */}
      <section className="px-4 py-12">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-accent w-8 h-8" />
            <h2 className="text-3xl font-bold">Sedang Trending</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-secondary rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {trending.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Anime */}
      <section className="px-4 py-12">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="text-primary w-8 h-8" />
            <h2 className="text-3xl font-bold">Paling Populer</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-secondary rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {popular.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
