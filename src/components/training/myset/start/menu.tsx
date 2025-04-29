import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TrainingSessionData } from "@/types/myset-training";
import { motion } from "framer-motion";

interface TodayMenuProps {
  sessionData: TrainingSessionData;
  onStart: () => void;
}

export function TodayMenu({ sessionData, onStart }: TodayMenuProps) {
  const totalSets = sessionData.workouts.reduce(
    (acc, workout) => acc + workout.sets.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{sessionData.name}</CardTitle>
          <CardDescription className="text-xs">
            全{sessionData.workouts.length}種目 / 合計
            {totalSets}セット
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionData.workouts.map((workout, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-md">{workout.menu}</h3>
                <span className="text-sm text-muted-foreground">
                  {workout.sets.length}セット
                </span>
              </div>

              {workout.memo && (
                <p className="text-xs text-muted-foreground mb-3">
                  {workout.memo}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center text-xs font-bold pb-2">
                  <span className="w-16">セット数</span>
                  <span className="flex-1">目標</span>
                  <span>回数</span>
                </div>
                {workout.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center text-xs border-b pb-2 last:border-0"
                  >
                    <span className="w-16">セット {setIndex + 1}:</span>
                    {workout.type === "weight" ? (
                      <>
                        <span className="flex-1">
                          {set.weight} {workout.unit}
                        </span>
                        <span>{set.reps} 回</span>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">
                          {set.distance} {workout.unit}
                        </span>
                        <span>{set.time}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={onStart} className="w-full">
            トレーニングを開始する
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
