import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkoutData, WorkoutSetData } from "@/types/myset-training";
import { cn } from "@/lib/utils";

interface SetInputProps {
  workout: WorkoutData;
  setIndex: number;
  previousSet?: WorkoutSetData;
  value: WorkoutSetData;
  onChange: (value: WorkoutSetData) => void;
}

export function SetInput({
  workout,
  setIndex,
  previousSet,
  value,
  onChange,
}: SetInputProps) {
  const handleChange = (field: keyof WorkoutSetData, val: string) => {
    const numVal =
      field !== "memo" && field !== "time" ? Number.parseFloat(val) || 0 : val;
    onChange({ ...value, [field]: numVal });
  };

  // 前回の記録と比較して増減を表示
  const getComparisonClass = (
    _field: "weight" | "reps" | "distance",
    current?: number,
    previous?: number
  ) => {
    if (!current || !previous) return "";
    if (current > previous) return "text-green-600";
    if (current < previous) return "text-red-600";
    return "text-muted-foreground";
  };

  // 前回との差分を計算
  const getDifference = (
    _field: "weight" | "reps" | "distance",
    current?: number,
    previous?: number
  ) => {
    if (!current || !previous) return null;
    const diff = current - previous;
    if (diff === 0) return null;
    return diff > 0 ? `+${diff}` : diff;
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">セット {setIndex + 1}</h3>
        {previousSet && (
          <span className="text-sm text-muted-foreground">前回の記録あり</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {workout.type === "weight" && (
          <>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label className="text-sm">目標重量 ({workout.unit})</Label>
                <Label className="text-sm py-2">
                  {value.weight}
                  {workout.unit}
                </Label>
              </div>
              <div className="flex justify-between">
                <Label htmlFor={`weight-${setIndex}`} className="text-sm">
                  重量 ({workout.unit})
                </Label>
                {previousSet?.weight && (
                  <span
                    className={cn(
                      "text-sm",
                      getComparisonClass(
                        "weight",
                        value.weight,
                        previousSet.weight
                      )
                    )}
                  >
                    前回: {previousSet.weight}{" "}
                    {getDifference(
                      "weight",
                      value.weight,
                      previousSet.weight
                    ) &&
                      `(${getDifference(
                        "weight",
                        value.weight,
                        previousSet.weight
                      )})`}
                  </span>
                )}
              </div>
              <Input
                id={`weight-${setIndex}`}
                type="number"
                step="0.5"
                value={value.weight || ""}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label className="text-sm">目標回数</Label>
                <Label className="text-sm py-2">{value.reps} 回</Label>
              </div>
              <div className="flex justify-between">
                <Label htmlFor={`reps-${setIndex}`} className="text-sm">
                  回数
                </Label>
                {previousSet?.reps && (
                  <span
                    className={cn(
                      "text-sm",
                      getComparisonClass("reps", value.reps, previousSet.reps)
                    )}
                  >
                    前回: {previousSet.reps}{" "}
                    {getDifference("reps", value.reps, previousSet.reps) &&
                      `(${getDifference(
                        "reps",
                        value.reps,
                        previousSet.reps
                      )})`}
                  </span>
                )}
              </div>
              <Input
                id={`reps-${setIndex}`}
                type="number"
                value={value.reps || ""}
                onChange={(e) => handleChange("reps", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </>
        )}

        {workout.type === "distance" && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={`distance-${setIndex}`} className="text-sm">
                  距離 ({workout.unit})
                </Label>
                {previousSet?.distance && (
                  <span
                    className={cn(
                      "text-sm",
                      getComparisonClass(
                        "distance",
                        value.distance,
                        previousSet.distance
                      )
                    )}
                  >
                    前回: {previousSet.distance}{" "}
                    {getDifference(
                      "distance",
                      value.distance,
                      previousSet.distance
                    ) &&
                      `(${getDifference(
                        "distance",
                        value.distance,
                        previousSet.distance
                      )})`}
                  </span>
                )}
              </div>
              <Input
                id={`distance-${setIndex}`}
                type="number"
                step="0.01"
                value={value.distance || ""}
                onChange={(e) => handleChange("distance", e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`time-${setIndex}`} className="text-sm">
                時間
              </Label>
              <Input
                id={`time-${setIndex}`}
                type="text"
                placeholder="00:00"
                value={value.time || ""}
                onChange={(e) => handleChange("time", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
