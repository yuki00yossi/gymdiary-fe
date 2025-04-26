import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "sonner";
import type { TrainerProfile } from "@/types/trainer";
import ApiClient from "@/lib/ApiClient";

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerProfile: TrainerProfile;
}

// 面談可能な時間帯（例）
const AVAILABLE_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export function InterviewModal({
  isOpen,
  onClose,
  trainerProfile,
}: InterviewModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 今日から2週間後までの日付を許可
  const disabledDays = {
    before: new Date(Date.now() + 24 * 60 * 60 * 1000),
    after: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  };

  const handleScheduleInterview = async () => {
    if (!date || !time) return;

    setIsSubmitting(true);

    try {
      // 面談予約APIを呼び出す（モックアップ）
      // const response = await fetch('/api/interview/schedule', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     date: format(date, 'yyyy-MM-dd'),
      //     time,
      //   }),
      // })
      const res = await ApiClient.post("/trainers/interview/", { date, time });

      console.log(res);

      toast("面談予約が完了しました", {
        description: `${format(date, "yyyy年MM月dd日", {
          locale: ja,
        })} ${time}に面談を予約しました。メールをご確認ください。`,
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast("エラーが発生しました。", {
        description: "面談の予約に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            面談予約
          </DialogTitle>
          <DialogDescription className="text-center">
            トレーナーとして活動を開始するには、30分ほどの面談が必要です。
            <br />
            <br />
            この面談では、本人確認およびGym
            Diaryを安全かつ効果的にご利用いただくための注意事項等のご説明を行います。
            <br />
            <br />
            ご希望の日時を選択し、面談予約を完了してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>日付を選択</span>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              className="rounded-md border mx-auto"
            />
          </div>

          {date && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>時間を選択</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_TIMES.map(
                  (t) => (
                    console.log(date, t),
                    (
                      <Button
                        key={t}
                        type="button"
                        variant={time === t ? "default" : "outline"}
                        className={
                          time === t ? "bg-orange-500 hover:bg-orange-600" : ""
                        }
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </Button>
                    )
                  )
                )}
              </div>
            </motion.div>
          )}
        </div>

        <Button
          onClick={handleScheduleInterview}
          disabled={!date || !time || isSubmitting}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              予約処理中...
            </>
          ) : (
            "面談予約に進む"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
