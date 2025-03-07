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
    console.log(res.data);
    setTrainingData(res.data);
  };

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-3xl font-bold">トレ履歴</h1>
          <Button asChild>
            <NavLink to="/training/add">
              <Plus className="mr-2 h-4 w-4" />
              トレ追加
            </NavLink>
          </Button>
        </div>

        <TrainingList trainingData={trainingData} />
      </div>
    </AnimatedPage>
  );
}
