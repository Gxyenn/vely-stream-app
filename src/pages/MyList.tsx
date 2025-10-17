import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { getMyList, removeFromMyList, MyListItem } from "@/lib/localStorage";

const MyList = () => {
  const navigate = useNavigate();
  const [myList, setMyList] = useState<MyListItem[]>([]);

  useEffect(() => {
    setMyList(getMyList());
  }, []);

  const handleRemove = (animeId: number, title: string) => {
    removeFromMyList(animeId);
    setMyList(getMyList());
    toast({
      title: "Dihapus dari List",
      description: `${title} telah dihapus dari list Anda`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-4xl font-bold">List Saya</h1>
        </div>

        {myList.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">
              List Anda masih kosong
            </p>
            <Button onClick={() => navigate("/")} className="gradient-primary">
              Jelajahi Anime
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {myList.map((item) => (
              <div key={item.animeId} className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden card-shadow mb-2">
                  <img
                    src={item.animeImage}
                    alt={item.animeTitle}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-smooth"
                    onClick={() => navigate(`/anime/${item.animeId}`)}
                  />
                  <Button
                    onClick={() => handleRemove(item.animeId, item.animeTitle)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h3
                  className="font-medium text-sm line-clamp-2 cursor-pointer group-hover:text-primary transition-smooth"
                  onClick={() => navigate(`/anime/${item.animeId}`)}
                >
                  {item.animeTitle}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyList;
