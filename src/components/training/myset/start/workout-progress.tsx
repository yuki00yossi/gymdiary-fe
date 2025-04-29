import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SetInput } from "./set-input";
import type {
  PreviousSessionData,
  TrainingSessionData,
  WorkoutData,
  WorkoutSetData,
} from "@/types/myset-training";
import { motion } from "framer-motion";
import { ArrowRight, XCircle } from "lucide-react";

interface WorkoutProgressProps {
  sessionData: TrainingSessionData;
  previousData: PreviousSessionData | null;
  workoutIndex: number;
  setIndex: number;
  onComplete: (updatedWorkout: WorkoutData) => void;
  onEndTraining: () => void; // トレーニング終了ハンドラーを追加
}

export function WorkoutProgress({
  sessionData,
  previousData,
  workoutIndex,
  setIndex,
  onComplete,
  onEndTraining,
}: WorkoutProgressProps) {
  const currentWorkout = sessionData.workouts[workoutIndex];
  const [currentSetData, setCurrentSetData] = useState<WorkoutSetData>({
    ...currentWorkout.sets[setIndex],
  });
  const [showEndConfirm, setShowEndConfirm] = useState(false); // 終了確認ダイアログの表示状態

  // 前回の記録があれば取得
  const getPreviousSetData = (): WorkoutSetData | undefined => {
    if (!previousData) return undefined;

    const prevWorkout = previousData.workouts.find(
      (w) => w.menu === currentWorkout.menu
    );
    if (!prevWorkout || !prevWorkout.sets[setIndex]) return undefined;

    return prevWorkout.sets[setIndex];
  };

  const previousSetData = getPreviousSetData();

  // 励ましメッセージを生成する関数
  const getMotivationalMessage = (): string | null => {
    if (!previousSetData) return null;

    // 重量トレーニングの場合
    if (
      currentWorkout.type === "weight" &&
      currentSetData.weight &&
      previousSetData.weight
    ) {
      if (currentSetData.weight > previousSetData.weight) {
        return "前回より重く！自己記録更新に挑戦！💪";
      }
      return "前回の記録を超えろ！過去の自分に勝て！🔥";
    }

    // 距離トレーニングの場合
    if (
      currentWorkout.type === "distance" &&
      currentSetData.distance &&
      previousSetData.distance
    ) {
      if (currentSetData.distance > previousSetData.distance) {
        return "さらに遠くへ！限界を超えろ！🏃‍♂️";
      }
      return "前回の距離を超えろ！一歩先へ進め！🚀";
    }

    return "前回の記録を超えろ！より強く、より速く！💯";
  };

  // 現在のセットデータを更新
  const handleSetDataChange = (data: WorkoutSetData) => {
    setCurrentSetData(data);
  };

  // セット完了時の処理
  const handleCompleteSet = () => {
    // 現在のワークアウトのコピーを作成
    const updatedWorkout = { ...currentWorkout };

    // 現在のセットを更新
    updatedWorkout.sets = [...updatedWorkout.sets];
    updatedWorkout.sets[setIndex] = currentSetData;

    onComplete(updatedWorkout);
  };

  // トレーニング終了確認を表示
  const handleEndTrainingClick = () => {
    setShowEndConfirm(true);
  };

  // 終了確認をキャンセル
  const handleCancelEnd = () => {
    setShowEndConfirm(false);
  };

  // 終了を確定
  const handleConfirmEnd = () => {
    setShowEndConfirm(false);
    onEndTraining();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{currentWorkout.menu}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>
              種目 {workoutIndex + 1}/{sessionData.workouts.length}
            </span>
            <span>
              セット {setIndex + 1}/{currentWorkout.sets.length}
            </span>
          </div>

          {currentWorkout.memo && (
            <div className="p-3 bg-muted rounded-md text-sm">
              <p>{currentWorkout.memo}</p>
            </div>
          )}

          {previousSetData && (
            <div className="p-3 bg-primary/10 rounded-md text-sm font-medium text-center animate-pulse">
              {getMotivationalMessage()}
            </div>
          )}

          <SetInput
            workout={currentWorkout}
            setIndex={setIndex}
            previousSet={previousSetData}
            value={currentSetData}
            onChange={handleSetDataChange}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleCompleteSet} className="w-full text-sm">
            保存して次へ <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* トレーニング終了ボタン */}
          <Button
            variant="outline"
            className="w-full text-sm text-red-500 hover:text-red-600"
            onClick={handleEndTrainingClick}
          >
            <XCircle className="mr-2 h-4 w-4" />
            終了する
          </Button>
        </CardFooter>
      </Card>

      {/* 終了確認ダイアログ */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">
              トレーニングを終了しますか？
            </h3>
            <p className="text-muted-foreground mb-4">
              現在までのトレーニング記録は保存されます。残りの種目はスキップされます。
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEnd}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={handleConfirmEnd}>
                終了する
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
