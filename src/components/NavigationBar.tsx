import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, Clock, TrendingUp, Calendar } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Cari Anime" },
    { path: "/my-list", icon: Heart, label: "List Saya" },
    { path: "/history", icon: Clock, label: "History" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth shrink-0 ${
                    isActive(item.path)
                      ? "gradient-primary text-white glow-effect"
                      : "bg-secondary/50 hover:bg-secondary text-foreground hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default NavigationBar;
