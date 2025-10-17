import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimeCard from "@/components/AnimeCard";
import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";

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

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      searchAnime(query);
    }
  }, [searchParams]);

  const searchAnime = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&sfw=true&limit=24`
      );
      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error("Error searching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
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

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-secondary rounded-lg" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6">
              Ditemukan {results.length} hasil untuk "{searchParams.get("q")}"
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {results.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          </>
        ) : searchParams.get("q") ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Tidak ada hasil untuk "{searchParams.get("q")}"
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Cari anime favoritmu di atas
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
