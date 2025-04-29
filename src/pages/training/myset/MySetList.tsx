import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { fetchMySets } from "@/lib/api/myset";
import { MySetList } from "@/components/training/myset/myset-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { MySetSummary } from "@/types/myset";
import { AnimatedPage } from "@/components/animated-page";

export default function MySetPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);
  const [mysets, setMySets] = useState<MySetSummary[]>([]);

  useEffect(() => {
    fetchMySetsData();
  }, []);

  const fetchMySetsData = async () => {
    try {
      const mySets = await fetchMySets();
      setMySets(mySets);
    } catch (error) {
      setErrors("マイセットの読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">マイセット一覧</h1>
          <Button asChild>
            <NavLink to="/training/myset/create" className="text-xs">
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </NavLink>
          </Button>
        </div>
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : errors ? (
          <div className="text-center p-8">
            <h3 className="text-md font-medium text-destructive">
              マイセットの読み込みに失敗しました
            </h3>
            <p className="text-muted-foreground mb-4">
              後でもう一度お試しください
            </p>
          </div>
        ) : (
          <MySetList mySets={mysets} />
        )}
      </div>
    </AnimatedPage>
  );
}
