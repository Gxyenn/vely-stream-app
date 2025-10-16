import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Tv, Calendar, Clock, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";

interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
  episodes: number;
  status: string;
  aired: {
    string: string;
  };
  duration: string;
  rating: string;
  synopsis: string;
  genres: Array<{ name: string }>;
  trailer: {
    youtube_id: string;
    url: string;
  };
}

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [relatedAnime, setRelatedAnime] = useState<any[]>([]);

  useEffect(() => {
    fetchAnimeDetail();
    fetchRelatedAnime();
  }, [id]);

  const fetchAnimeDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const data = await response.json();
      setAnime(data.data);
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedAnime = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
      const data = await response.json();
      setRelatedAnime(data.data.slice(0, 10).map((item: any) => item.entry));
    } catch (error) {
      console.error("Error fetching related anime:", error);
    }
  };

  const handleWatchTrailer = () => {
    if (anime?.trailer?.youtube_id) {
      window.open(anime.trailer.url, "_blank");
    }
  };

  const generateEpisodes = () => {
    if (!anime?.episodes) return [];
    return Array.from({ length: anime.episodes }, (_, i) => i + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-secondary rounded mb-8" />
            <div className="aspect-[2/3] max-w-sm mx-auto bg-secondary rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Anime tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const episodes = generateEpisodes();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Anime Info */}
        <div className="max-w-4xl mx-auto">
          {/* Poster */}
          <div className="aspect-[2/3] max-w-sm mx-auto rounded-lg overflow-hidden card-shadow mb-6 animate-scale-in">
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-2 animate-fade-in-up">
            {anime.title}
          </h1>
          {anime.title_english && (
            <p className="text-xl text-muted-foreground text-center mb-6 animate-fade-in-up">
              {anime.title_english}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap animate-fade-in-up">
            {anime.score > 0 && (
              <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-lg">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{anime.score}</span>
              </div>
            )}
            {anime.episodes && (
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
                <Tv className="w-5 h-5" />
                <span className="font-medium">{anime.episodes} Episodes</span>
              </div>
            )}
            {anime.status && (
              <Badge className="px-4 py-2 text-base gradient-primary">
                {anime.status === "Finished Airing" ? "Tamat" : "Tayang"}
              </Badge>
            )}
          </div>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-up">
              {anime.genres.map((genre) => (
                <Badge key={genre.name} variant="outline" className="border-primary/40">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-8 animate-fade-in-up">
            {anime.trailer?.youtube_id && (
              <Button
                onClick={handleWatchTrailer}
                className="gradient-primary glow-effect px-8"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Watch Trailer
              </Button>
            )}
            <Button
              onClick={() => setShowEpisodes(!showEpisodes)}
              variant="outline"
              className="border-primary/40 hover:bg-primary/10 px-8"
              size="lg"
            >
              <Tv className="w-5 h-5 mr-2" />
              Show Episodes
            </Button>
          </div>

          {/* Episode List */}
          {showEpisodes && episodes.length > 0 && (
            <div className="mb-8 animate-fade-in">
              <h3 className="text-2xl font-bold mb-4">Episodes</h3>
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-4">
                  {episodes.map((ep) => (
                    <Button
                      key={ep}
                      onClick={() => navigate(`/watch/${anime.mal_id}/${ep}`)}
                      className="gradient-card hover:gradient-primary min-w-[80px] h-12 transition-smooth"
                    >
                      EP {ep}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}

          {/* Synopsis */}
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed">
              {anime.synopsis || "Tidak ada sinopsis tersedia."}
            </p>
          </div>

          {/* Information */}
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <div className="space-y-3 bg-secondary/50 rounded-lg p-6">
              {anime.aired?.string && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Aired</p>
                    <p className="font-medium">{anime.aired.string}</p>
                  </div>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{anime.duration}</p>
                  </div>
                </div>
              )}
              {anime.rating && (
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium">{anime.rating}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Anime */}
          {relatedAnime.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-4">Anime Terkait</h2>
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                  {relatedAnime.map((related) => (
                    <div key={related.mal_id} className="min-w-[200px]">
                      <AnimeCard anime={related} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
