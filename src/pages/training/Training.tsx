import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NavLink } from "react-router";
import TrainingList from "@/components/training/training-list";
import { AnimatedPage } from "@/components/animated-page";
import { useEffect, useState } from "react";
import ApiClient from "@/lib/ApiClient";
import type { TrainingRecord } from "@/types/training";

export default function TrainingPage() {
  const [trainingData, setTrainingData] = useState<TrainingRecord[]>([]);
  useEffect(() => {
    fetchTraining();
  }, []);

  const fetchTraining = async () => {
    const res = await ApiClient.get(
      import.meta.env.VITE_API_ROOT + "/training/"
    );
    setTrainingData(res.data);
  };

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold">ワークアウト</h1>
          <Button asChild className="bg-secondary">
            <NavLink to="/training/myset" className="text-sm">
              <span className="text-primary">マイセット</span>
            </NavLink>
          </Button>
        </div>
        <div>
          <Button asChild className="w-full">
            <NavLink to="/training/create" className="text-sm">
              <Plus className="h-4 w-4" />
              記録する
            </NavLink>
          </Button>
        </div>

        <TrainingList trainingData={trainingData} />
      </div>
    </AnimatedPage>
  );
}
