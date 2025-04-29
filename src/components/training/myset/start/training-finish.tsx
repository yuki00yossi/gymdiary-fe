import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { TrainingSessionData } from "@/types/myset-training";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Share2 } from "lucide-react";
import { useNavigate } from "react-router";
import { ShareModal } from "@/components/share-modal";
import { motivationalQuotes } from "@/assets/proverb";

interface TrainingFinishProps {
  sessionData: TrainingSessionData;
  previousData?: any;
  onSave: (notes: string) => Promise<void>;
}

export function TrainingFinish({
  sessionData,
  previousData,
  onSave,
}: TrainingFinishProps) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  // ランダムな名言を選ぶ
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(notes);
      // 保存成功後、少し待ってから遷移
      setTimeout(() => {
        navigate("/training/myset");
      }, 1500);
    } catch (error) {
      console.error("保存エラー:", error);
      setIsSaving(false);
    }
  };

  // 保存せずに終了する関数
  const handleExitWithoutSaving = () => {
    setShowConfirmDialog(true);
  };

  // 確認後に終了する関数
  const confirmExit = () => {
    navigate("/training/myset");
  };

  // 確認をキャンセルする関数
  const cancelExit = () => {
    setShowConfirmDialog(false);
  };

  // シェアモーダルを開く
  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  // 種目とセットの詳細を表示するコンポーネント
  const WorkoutSummary = () => (
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-medium">実施内容:</h4>
      {sessionData.workouts.map((workout, idx) => (
        <div key={idx} className="bg-muted/50 p-3 rounded-md">
          <div className="text-sm font-medium">{workout.menu}</div>
          <div className="text-sm text-muted-foreground">
            {workout.sets.length} セット •{" "}
            {workout.type === "weight" ? "重量" : "距離"}トレーニング
          </div>
        </div>
      ))}
    </div>
  );

  // 合計セット数を計算
  const totalSets = sessionData.workouts.reduce(
    (acc, workout) => acc + workout.sets.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-32"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-md">
            <CheckCircle className="mr-2 h-6 w-6 text-primary" />
            トレーニング完了！
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium">お疲れ様でした！</p>
            <p className="text-sm text-muted-foreground">
              素晴らしいトレーニングでした！
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">{sessionData.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-sm">
                <span className="text-muted-foreground">種目数:</span>{" "}
                {sessionData.workouts.length}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">合計セット:</span>{" "}
                {totalSets}
              </div>
            </div>
          </div>

          <WorkoutSummary />

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              トレーニングメモ
            </label>
            <Textarea
              id="notes"
              placeholder="今日のトレーニングの感想や気づきを記録しましょう..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="text-sm"
            />
          </div>

          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="italic text-sm">"{randomQuote.quote}"</p>
            <p className="text-sm text-muted-foreground mt-2">
              - {randomQuote.author}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleOpenShareModal}
          >
            <Share2 className="mr-2 h-4 w-4" />
            トレーニング記録をシェア
          </Button>
        </CardContent>
      </Card>

      {/* シェアモーダル */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sessionData={sessionData}
        previousData={previousData}
      />

      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">保存せずに終了しますか？</h3>
            <p className="text-muted-foreground mb-4">
              トレーニング記録は保存されません。本当に終了しますか？
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelExit}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={confirmExit}>
                保存せずに終了
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 固定ボタン */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4 flex flex-col space-y-2">
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 保存中...
            </>
          ) : (
            "記録を保存して終了"
          )}
        </Button>
        {!isSaving && (
          <Button
            variant="outline"
            onClick={handleExitWithoutSaving}
            className="w-full"
          >
            保存せずに終了
          </Button>
        )}
      </div>
    </motion.div>
  );
}
