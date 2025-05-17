import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { AnimatePresence } from "framer-motion";
import { StepProgressBar } from "@/components/training/myset/start/step-progress-bar";
import { TodayMenu } from "@/components/training/myset/start/menu";
import { WorkoutProgress } from "@/components/training/myset/start/workout-progress";
import { IntervalTimer } from "@/components/training/myset/start/interval-timer";
import { TrainingFinish } from "@/components/training/myset/start/training-finish";
import {
  getMySetForTraining,
  getPreviousSession,
  saveTrainingSession,
} from "@/lib/api/myset";
import type {
  TrainingSessionData,
  TrainingStep,
  WorkoutData,
  WorkoutSetData,
  CreateTrainingSessionRequest,
  PreviousSessionData,
} from "@/types/myset-training";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export default function TrainingStartPage() {
  const params = useParams();
  const mysetId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<TrainingSessionData | null>(
    null
  );
  const [previousData, setPreviousData] = useState<PreviousSessionData | null>(
    null
  );

  const [trainingStep, setTrainingStep] = useState<TrainingStep>("menu");
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  // 完了したセットのメモ
  const [completedSetMemo, setCompletedSetMemo] = useState("");
  // 完了したワークアウトを保持
  const [completedWorkout, setCompletedWorkout] = useState<WorkoutData | null>(
    null
  );

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mysetData = await getMySetForTraining(mysetId);
        setSessionData(mysetData);
      } catch (error) {
        console.error("データ取得エラー:", error);
        toast.error("エラー", {
          description: "トレーニングデータの取得に失敗しました",
        });
      }

      try {
        const prevData = await getPreviousSession(mysetId);
        setPreviousData(prevData);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    fetchData();
  }, [mysetId]);

  // トレーニング開始
  const handleStartTraining = () => {
    setTrainingStep("workout");
  };

  // セット完了時の処理を更新
  const handleCompleteSet = (updatedWorkout: WorkoutData) => {
    if (!sessionData) return;

    // 完了したワークアウトを保存
    const updatedSets = [...updatedWorkout.sets];
    updatedSets[currentSetIndex] = {
      ...updatedSets[currentSetIndex],
      done: true,
    };

    const updatedWorkoutWithDone: WorkoutData = {
      ...updatedWorkout,
      sets: updatedSets,
    };
    setCompletedWorkout(updatedWorkoutWithDone);

    // セッションデータを更新
    const updatedSessionData = { ...sessionData };
    updatedSessionData.workouts = [...updatedSessionData.workouts];
    updatedSessionData.workouts[currentWorkoutIndex] = updatedWorkoutWithDone;
    setSessionData(updatedSessionData);

    // インターバル画面に移行
    setTrainingStep("interval");
    setCompletedSetMemo(""); // メモをリセット
  };

  // インターバル完了時の処理
  const handleIntervalComplete = () => {
    if (!sessionData) return;

    // メモが入力されていれば、完了したセットのメモとして設定
    if (completedSetMemo && completedWorkout) {
      const updatedSessionData = { ...sessionData };
      updatedSessionData.workouts = [...updatedSessionData.workouts];

      // 完了したセットにメモを追加
      const updatedSets = [
        ...updatedSessionData.workouts[currentWorkoutIndex].sets,
      ];
      updatedSets[currentSetIndex] = {
        ...updatedSets[currentSetIndex],
        memo: completedSetMemo,
      };

      updatedSessionData.workouts[currentWorkoutIndex].sets = updatedSets;
      setSessionData(updatedSessionData);
    }

    const currentWorkout = sessionData.workouts[currentWorkoutIndex];

    // 次のセットまたは種目に進む
    if (currentSetIndex < currentWorkout.sets.length - 1) {
      // 同じ種目の次のセットへ
      setCurrentSetIndex(currentSetIndex + 1);
      setTrainingStep("workout");
    } else if (currentWorkoutIndex < sessionData.workouts.length - 1) {
      // 次の種目の最初のセットへ
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
      setCurrentSetIndex(0);
      setTrainingStep("workout");
    } else {
      // すべての種目・セットが完了
      setTrainingStep("finish");
    }
  };

  // 追加セットを挿入する処理
  const handleAddExtraSet = () => {
    if (!sessionData || !completedWorkout) return;

    // 現在の種目に新しいセットを追加
    const updatedSessionData = { ...sessionData };
    const currentWorkout = {
      ...updatedSessionData.workouts[currentWorkoutIndex],
    };

    // 最後のセットをコピーして新しいセットを作成
    const lastSet = currentWorkout.sets[currentWorkout.sets.length - 1];
    const newSet: WorkoutSetData = {
      weight: lastSet.weight,
      reps: lastSet.reps,
      distance: lastSet.distance,
      time: lastSet.time,
      memo: "",
    };

    // 新しいセットを追加
    currentWorkout.sets = [...currentWorkout.sets, newSet];
    updatedSessionData.workouts[currentWorkoutIndex] = currentWorkout;

    // 状態を更新
    setSessionData(updatedSessionData);
    setCurrentSetIndex(currentWorkout.sets.length - 1);
    setTrainingStep("workout");

    toast("セット追加", {
      description: `${currentWorkout.menu}にもう1セット追加しました`,
    });
  };

  // メモ変更ハンドラー
  const handleMemoChange = (memo: string) => {
    setCompletedSetMemo(memo);
  };

  // トレーニング記録の保存
  const handleSaveTraining = async (notes: string) => {
    if (!sessionData) return;

    try {
      const requestData: CreateTrainingSessionRequest = {
        mysetId: sessionData.id,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        workouts: sessionData.workouts.map((workout) => ({
          menu: workout.menu,
          type: workout.type,
          unit: workout.unit,
          memo: workout.memo,
          sets: workout.sets
            .filter((set) => set.done)
            .map((set) => ({
              weight: set.weight,
              reps: set.reps,
              distance: set.distance,
              time: set.time,
              memo: set.memo || notes, // メモがなければ全体のメモを使用
            })),
        })),
      };

      console.log(completedWorkout);

      const result = await saveTrainingSession(requestData);

      if (result.success) {
        toast("保存完了", {
          description: "トレーニング記録を保存しました",
        });
      } else {
        throw new Error("保存に失敗しました");
      }
    } catch (error) {
      console.error("保存エラー:", error);
      toast.error("エラー", {
        description: "トレーニング記録の保存に失敗しました",
      });
      throw error;
    }
  };

  // 現在の種目の合計セット数を取得
  const getCurrentWorkoutTotalSets = () => {
    if (!sessionData) return 0;
    return sessionData.workouts[currentWorkoutIndex]?.sets.length || 0;
  };

  // 次の種目を取得
  const getNextWorkout = (): WorkoutData | WorkoutSetData | undefined => {
    if (!sessionData) return undefined;

    // 同じ種目の次のセットがある場合は次のセットの情報を返す
    if (
      currentSetIndex <
      sessionData.workouts[currentWorkoutIndex].sets.length - 1
    ) {
      return sessionData.workouts[currentWorkoutIndex].sets[
        currentWorkoutIndex + 1
      ];
    }

    // 次の種目がある場合はそれを返す
    if (currentWorkoutIndex < sessionData.workouts.length - 1) {
      return sessionData.workouts[currentWorkoutIndex + 1];
    }

    return undefined;
  };

  // 現在のセットが種目の最後のセットかどうか
  const isLastSetOfWorkout = (): boolean => {
    if (!sessionData) return false;
    return (
      currentSetIndex ===
      sessionData.workouts[currentWorkoutIndex].sets.length - 1
    );
  };

  // 次の種目へスキップする関数
  const handleSkipToNextWorkout = () => {
    if (!sessionData) return;

    // 次の種目の最初のセットへ
    if (currentWorkoutIndex < sessionData.workouts.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
      setCurrentSetIndex(0);
      setTrainingStep("workout");
    } else {
      // すべての種目が完了している場合は完了画面へ
      setTrainingStep("finish");
    }
  };

  // 次の種目があるかどうかを確認する関数
  const hasNextWorkout = (): boolean => {
    if (!sessionData) return false;
    return currentWorkoutIndex < sessionData.workouts.length - 1;
  };

  // トレーニングを終了する関数
  const handleEndTraining = () => {
    // 現在までの記録を保存して完了画面に移動
    setTrainingStep("finish");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin" size="lg" />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="p-4">
        <p>トレーニングデータの取得に失敗しました。</p>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <StepProgressBar
        totalWorkouts={sessionData.workouts.length}
        currentWorkoutIndex={currentWorkoutIndex}
        totalSets={getCurrentWorkoutTotalSets()}
        currentSetIndex={currentSetIndex}
        step={trainingStep}
      />

      <AnimatePresence mode="wait">
        {trainingStep === "menu" && (
          <TodayMenu
            key="menu"
            sessionData={sessionData}
            onStart={handleStartTraining}
          />
        )}

        {trainingStep === "workout" && (
          <WorkoutProgress
            key={`workout-${currentWorkoutIndex}-${currentSetIndex}`}
            sessionData={sessionData}
            previousData={previousData}
            workoutIndex={currentWorkoutIndex}
            setIndex={currentSetIndex}
            onComplete={handleCompleteSet}
            onEndTraining={handleEndTraining} // トレーニング終了ハンドラーを渡す
          />
        )}

        {trainingStep === "interval" && completedWorkout && (
          <IntervalTimer
            key={`interval-${currentWorkoutIndex}-${currentSetIndex}`}
            defaultSeconds={60}
            onComplete={handleIntervalComplete}
            onSkip={handleIntervalComplete}
            onSkipToNextWorkout={handleSkipToNextWorkout}
            onEndTraining={handleEndTraining} // トレーニング終了ハンドラーを渡す
            memo={completedSetMemo}
            onMemoChange={handleMemoChange}
            completedWorkout={completedWorkout}
            nextWorkout={getNextWorkout()}
            onAddExtraSet={isLastSetOfWorkout() ? handleAddExtraSet : undefined}
            isLastSetOfWorkout={isLastSetOfWorkout()}
            hasNextWorkout={hasNextWorkout()}
          />
        )}

        {trainingStep === "finish" && (
          <TrainingFinish
            key="finish"
            sessionData={sessionData}
            previousData={previousData}
            onSave={handleSaveTraining}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
