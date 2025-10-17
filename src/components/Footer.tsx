import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold text-primary">Gxyenn</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VelyStream. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl">
            VelyStream menyediakan streaming anime subtitle Indonesia gratis. Semua konten anime adalah milik dari pemilik hak cipta masing-masing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
