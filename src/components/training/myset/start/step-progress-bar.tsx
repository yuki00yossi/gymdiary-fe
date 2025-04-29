import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StepProgressBarProps {
  totalWorkouts: number;
  currentWorkoutIndex: number;
  totalSets: number;
  currentSetIndex: number;
  step: "menu" | "workout" | "interval" | "finish";
}

export function StepProgressBar({
  totalWorkouts,
  currentWorkoutIndex,
  totalSets,
  currentSetIndex,
  step,
}: StepProgressBarProps) {
  // 全体の進捗率を計算
  const calculateProgress = () => {
    if (step === "menu") return 0;
    if (step === "finish") return 100;

    // 各ワークアウトの重みを計算
    const workoutWeight = 100 / totalWorkouts;

    // 現在のワークアウトまでの進捗
    const completedWorkoutsProgress = currentWorkoutIndex * workoutWeight;

    // 現在のワークアウト内の進捗
    const currentWorkoutProgress =
      (currentSetIndex / totalSets) * workoutWeight;

    return completedWorkoutsProgress + currentWorkoutProgress;
  };

  const progress = calculateProgress();

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>開始</span>
        <span>{Math.round(progress)}%</span>
        <span>完了</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-sm">
        <span
          className={cn(
            "font-medium",
            step === "menu" ? "text-primary" : "text-muted-foreground"
          )}
        >
          メニュー確認
        </span>
        <span
          className={cn(
            "font-medium",
            step === "workout" ? "text-primary" : "text-muted-foreground"
          )}
        >
          トレーニング中
        </span>
        <span
          className={cn(
            "font-medium",
            step === "finish" ? "text-primary" : "text-muted-foreground"
          )}
        >
          完了
        </span>
      </div>
    </div>
  );
}
