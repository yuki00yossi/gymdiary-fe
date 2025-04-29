import { NavLink, useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  ChevronLeft,
  Dumbbell,
  Pencil,
  Route,
  StickyNote,
  Timer,
  Trash2,
} from "lucide-react";
import { AnimatedPage } from "@/components/animated-page";
import { useEffect, useState } from "react";
import ApiClient from "@/lib/ApiClient";
import { TrainingRecord } from "@/types/training";

export default function TrainingDetailPage() {
  const navigate = useNavigate();
  const params = useParams();

  const [record, setRecord] = useState<TrainingRecord | null>(null);

  //   if (!record.length) {
  //     return <div>Training not found</div>;
  //   }

  useEffect(() => {
    fetchRecordInfo();
  }, [params.id]);

  const fetchRecordInfo = async () => {
    const record_id = params.id;
    const training = await ApiClient.get(
      import.meta.env.VITE_API_ROOT + "/training/" + record_id
    );
    setRecord(training.data);
  };

  const handleDelete = async () => {
    const deleteUrl = `${import.meta.env.VITE_API_ROOT}/training/${
      record?.id
    }/`;
    await ApiClient.delete(deleteUrl);
    navigate("/training");
  };

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/training")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">トレ情報</h1>
        </div>

        <div className="space-y-6">
          {!record?.workouts ? (
            <p>トレーニングデータが見つかりませんでした。</p>
          ) : (
            record.workouts.map((workout, workoutIndex) => (
              <Card key={workoutIndex}>
                <CardHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-5 w-5" />
                      <span>
                        {format(new Date(record.date), "yyyy年MM月dd日 (E)", {
                          locale: ja,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {workout.type === "weight" ? (
                        <Dumbbell className="h-6 w-6 text-primary" />
                      ) : (
                        <Route className="h-6 w-6 text-primary" />
                      )}
                      <CardTitle className="text-2xl">{workout.menu}</CardTitle>
                    </div>
                    {workout.memo && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <StickyNote className="h-5 w-5 shrink-0 mt-0.5" />
                        <p>{workout.memo}</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">セット一覧</h3>
                    <div className="space-y-4">
                      {workout.type === "weight"
                        ? workout.sets.map((set, index) => (
                            <Card key={index}>
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    セット {index + 1}
                                  </span>
                                  <span className="font-medium">
                                    {set.weight}
                                    {workout.unit} × {set.reps}回
                                  </span>
                                </div>
                                {set.memo && (
                                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <StickyNote className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p>{set.memo}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        : workout.sets.map((set, index) => (
                            <Card key={index}>
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">
                                    セット {index + 1}
                                  </span>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <Route className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        {set.distance}
                                        {workout.unit}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Timer className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        {set.time}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {set.memo && (
                                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <StickyNote className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p>{set.memo}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="outline" asChild>
                      <NavLink to={`/training/${record.id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        編集
                      </NavLink>
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
