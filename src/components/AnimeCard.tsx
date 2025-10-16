import { Link } from "react-router-dom";
import { Star, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  anime: {
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
  };
  showNewBadge?: boolean;
}

const AnimeCard = ({ anime, showNewBadge = false }: AnimeCardProps) => {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group relative block animate-fade-in"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden card-shadow anime-card">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        
        {/* Info Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="flex items-center gap-2 text-sm">
            {anime.score > 0 && (
              <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 rounded">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold">{anime.score}</span>
              </div>
            )}
            {anime.episodes && (
              <div className="flex items-center gap-1 bg-secondary/90 px-2 py-1 rounded">
                <Tv className="w-3 h-3" />
                <span>{anime.episodes} Eps</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {anime.status === "Currently Airing" && (
          <Badge className="absolute top-2 right-2 bg-accent text-white border-0 animate-glow-pulse">
            Tayang
          </Badge>
        )}

        {showNewBadge && (
          <Badge className="absolute top-2 left-2 gradient-primary text-white border-0">
            Baru!
          </Badge>
        )}

        {/* Score Badge - Always Visible */}
        {anime.score > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded backdrop-blur-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold">{anime.score}</span>
          </div>
        )}
      </div>

      <h3 className="mt-3 font-semibold text-sm line-clamp-2 group-hover:text-primary transition-smooth">
        {anime.title}
      </h3>
    </Link>
  );
};

export default AnimeCard;
