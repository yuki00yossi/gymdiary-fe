import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Play, Pause, Plus, XCircle } from "lucide-react";
import type { WorkoutData, WorkoutSetData } from "@/types/myset-training";

interface IntervalTimerProps {
  defaultSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
  onSkipToNextWorkout?: () => void;
  onEndTraining: () => void; // トレーニング終了ハンドラーを追加
  memo: string;
  onMemoChange: (memo: string) => void;
  completedWorkout: WorkoutData;
  nextWorkout?: WorkoutData | WorkoutSetData;
  onAddExtraSet?: () => void;
  isLastSetOfWorkout: boolean;
  hasNextWorkout: boolean;
}

export function IntervalTimer({
  defaultSeconds,
  onComplete,
  onSkip,
  onSkipToNextWorkout,
  onEndTraining,
  memo,
  onMemoChange,
  nextWorkout,
  onAddExtraSet,
  isLastSetOfWorkout,
  hasNextWorkout,
}: IntervalTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customSeconds, setCustomSeconds] = useState(defaultSeconds);
  const [showEndConfirm, setShowEndConfirm] = useState(false); // 終了確認ダイアログの表示状態

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && seconds === 0) {
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onComplete]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCustomTimeChange = (value: number[]) => {
    setCustomSeconds(value[0]);
  };

  const applyCustomTime = () => {
    setSeconds(customSeconds);
    setIsRunning(true);
  };

  // 残り時間に応じて色を変える
  const getTimerColor = () => {
    if (seconds <= 5) return "text-red-500";
    if (seconds <= 15) return "text-amber-500";
    return "text-primary";
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-md">インターバル</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs text-center">
            お疲れ様です！少し休んで次に備えましょう！
          </p>
          {/* 完了した種目の情報 */}
          {/* <div className="p-3 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-1">完了した種目</h3>
            <p className="text-sm">{completedWorkout.menu}</p>
          </div> */}

          {/* タイマー表示 */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mt-2 mb-2">
              次のセットまでの休憩時間
            </p>
            <motion.div
              key={seconds}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-mono font-bold ${getTimerColor()}`}
            >
              {formatTime(seconds)}
            </motion.div>
          </div>

          {/* タイマーコントロール */}
          <div className="flex justify-center space-x-4">
            {!isRunning && seconds === defaultSeconds ? (
              <Button onClick={startTimer} variant="default" className="w-full">
                休憩開始
              </Button>
            ) : (
              <Button variant="outline" size="icon" onClick={toggleTimer}>
                {isRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* タイマー調整 */}
          <div className="space-y-2">
            <p className="text-sm">インターバル時間を調整:</p>
            <div className="flex items-center space-x-4">
              <span className="text-sm">15秒</span>
              <Slider
                value={[customSeconds]}
                min={15}
                max={300}
                step={15}
                onValueChange={handleCustomTimeChange}
                className="flex-1"
              />
              <span className="text-sm">5分</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {formatTime(customSeconds)}
              </span>
              <Button
                className="bg-primary text-white text-xs"
                size="sm"
                variant="secondary"
                onClick={applyCustomTime}
                disabled={customSeconds === seconds}
              >
                適用
              </Button>
            </div>
          </div>

          {/* 完了したセットのメモ入力 */}
          <div className="space-y-2 mt-4 border-t pt-4">
            <p className="text-sm font-bold">メモ</p>
            <textarea
              className="w-full p-2 border rounded-md text-xs"
              placeholder="このセットで感じたことをメモしておこう！最後のセットの感想や、次回の目標など..."
              value={memo}
              onChange={(e) => onMemoChange(e.target.value)}
              rows={5}
            />
          </div>

          {/* 次の種目情報（ある場合） */}
          {nextWorkout && "sets" in nextWorkout && (
            <div className="p-3 bg-primary/10 rounded-md">
              <h3 className="font-medium mb-1">次の種目</h3>
              <p className="text-sm">{nextWorkout.menu}</p>
              {nextWorkout.memo && (
                <p className="text-xs text-muted-foreground mt-1">
                  {nextWorkout.memo}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full mb-8" onClick={onSkip}>
            スキップして次へ
          </Button>

          {/* 次の種目へスキップするボタン */}
          {hasNextWorkout && onSkipToNextWorkout && (
            <Button
              variant="outline"
              className="w-full font-normal text-xs"
              onClick={onSkipToNextWorkout}
            >
              残セットをスキップして次の種目へ
            </Button>
          )}

          {/* 最後のセットで、かつ追加セットの選択肢がある場合 */}
          {isLastSetOfWorkout && onAddExtraSet && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onAddExtraSet}
            >
              <Plus className="mr-2 h-4 w-4" />
              もう1セット追加する
            </Button>
          )}

          {/* トレーニング終了ボタン */}
          <Button
            variant="outline"
            className="w-full text-xs text-red-500 hover:text-red-600"
            onClick={handleEndTrainingClick}
          >
            <XCircle className="mr-2 h-4 w-4" />
            トレーニングを終了する
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
