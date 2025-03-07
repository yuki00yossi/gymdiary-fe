import { format } from "date-fns";
import { Dumbbell, Route, CalendarDays, StickyNote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ja } from "date-fns/locale";
import type {
  TrainingRecord,
  Workout,
  WeightWorkout,
  DistanceWorkout,
} from "@/types/training";
import { NavLink } from "react-router";

interface TrainingListItemProps {
  record: TrainingRecord;
}

function WorkoutSummary({ workout }: { workout: Workout }) {
  const icon =
    workout.type === "weight" ? (
      <Dumbbell className="h-5 w-5 text-primary shrink-0" />
    ) : (
      <Route className="h-5 w-5 text-primary shrink-0" />
    );

  const summary =
    workout.type === "weight" ? (
      <div className="text-sm text-muted-foreground">
        {(workout as WeightWorkout).sets.map((set, index) => (
          <span key={index}>
            {index > 0 && ", "}
            {set.weight}kg × {set.reps}回
          </span>
        ))}
      </div>
    ) : (
      <div className="text-sm text-muted-foreground">
        {(workout as DistanceWorkout).sets.map((set, index) => (
          <span key={index}>
            {index > 0 && ", "}
            {set.distance}km / {set.time}
          </span>
        ))}
      </div>
    );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-medium">{workout.menu}</h3>
      </div>
      {summary}
      {workout.memo && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <StickyNote className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{workout.memo}</p>
        </div>
      )}
    </div>
  );
}

export function TrainingListItem({ record }: TrainingListItemProps) {
  return (
    <NavLink to={`/training/${record.id}`} className={"block"}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="p-4 py-0 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {format(new Date(record.date), "yyyy年MM月dd日 (E)", {
                locale: ja,
              })}
            </span>
          </div>
          <div className="space-y-4 pl-1">
            {record.workouts.map((workout, index) => (
              <WorkoutSummary key={index} workout={workout} />
            ))}
          </div>
        </CardContent>
      </Card>
    </NavLink>
  );
}
