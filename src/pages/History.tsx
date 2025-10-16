import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { getWatchHistory, clearWatchHistory, WatchHistory as WatchHistoryType } from "@/lib/localStorage";

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<WatchHistoryType[]>([]);

  useEffect(() => {
    setHistory(getWatchHistory());
  }, []);

  const handleClearHistory = () => {
    clearWatchHistory();
    setHistory([]);
    toast({
      title: "History Dihapus",
      description: "Semua history tontonan telah dihapus",
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">History Tontonan</h1>
          </div>
          {history.length > 0 && (
            <Button
              onClick={handleClearHistory}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">
              Belum ada history tontonan
            </p>
            <Button onClick={() => navigate("/")} className="gradient-primary">
              Mulai Menonton
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={`${item.animeId}-${item.episode}-${index}`}
                className="glass-effect rounded-lg p-4 hover:bg-secondary/50 transition-smooth cursor-pointer"
                onClick={() => navigate(`/watch/${item.animeId}/${item.episode}`)}
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.animeImage}
                      alt={item.animeTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-smooth">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-smooth">
                        {item.animeTitle}
                      </h3>
                      <Badge className="mb-2">Episode {item.episode}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/watch/${item.animeId}/${item.episode}`);
                      }}
                      className="gradient-primary w-fit gap-2"
                      size="sm"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Lanjutkan Nonton
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
