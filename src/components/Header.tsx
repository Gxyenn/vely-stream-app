import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center glow-effect group-hover:animate-glow-pulse">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VelyStream
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Cari Anime
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
