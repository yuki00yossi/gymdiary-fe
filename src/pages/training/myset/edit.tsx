import { useEffect, useState } from "react";
import { fetchMySetById } from "@/lib/api/myset";
import { MySetForm } from "@/components/training/myset/myset-form";
import { useParams } from "react-router";
import { MySetDetail } from "@/types/myset";
import { AnimatedPage } from "@/components/animated-page";
import { LoaderCircle } from "lucide-react";

export default function EditMySetPage() {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [myset, setMyset] = useState<MySetDetail | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    const id = parseInt(params.id || "0", 10);
    if (isNaN(id)) {
      // Handle invalid ID case
      setErrors("無効なIDです");
    }
    fetchMySet(id);
  }, [params.id]);

  const fetchMySet = async (id: number) => {
    setLoading(true);
    setErrors(null);
    try {
      const myset = await fetchMySetById(id);
      setMyset(myset);
    } catch (error) {
      setErrors("マイセットの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto p-4 md:p-6">
        {isLoading && <LoaderCircle className="animate-spin" />}
        {errors && (
          <div className="text-center p-8">
            <h3 className="text-md font-medium text-destructive">{errors}</h3>
            <p className="text-muted-foreground mb-4">
              後でもう一度お試しください
            </p>
          </div>
        )}
        {!isLoading && !errors && myset && (
          <MySetForm initialData={myset} isEditing={true} />
        )}
      </div>
    </AnimatedPage>
  );
}
