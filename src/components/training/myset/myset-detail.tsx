import { useState } from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import type { MySetDetail } from "@/types/myset";
import { deleteMySet } from "@/lib/api/myset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Play } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface MySetDetailProps {
  mySet: MySetDetail;
}

export function MySetDetailView({ mySet }: MySetDetailProps) {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMySet(mySet.id);
      toast.success("成功", {
        description: "マイセットを削除しました",
      });
      navigate("/training/myset");
    } catch (error) {
      toast.error("エラー", {
        description: "マイセットの削除に失敗しました",
      });
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <NavLink to="/training/myset">
            <ArrowLeft className="mr-1 h-4 w-4" />
          </NavLink>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">{mySet.name}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <NavLink
                to={`/training/myset/${mySet.id}/edit`}
                className="text-xs"
              >
                <Edit className="mr-1 h-4 w-4" />
                編集
              </NavLink>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Trash2 className="mr-1 h-4 w-4" />
                  削除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    マイセット「{mySet.name}
                    」を削除します。この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "削除中..." : "削除"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            <p>作成者: {mySet.created_by.username}</p>
          </div>

          <Button className="w-full" asChild>
            <NavLink
              to={`/training/myset/${mySet.id}/start`}
              className="text-xs"
            >
              <Play className="mr-2 h-4 w-4" />
              記録開始
            </NavLink>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mySet.workouts.map((workout) => (
            <div key={workout.id}>
              <h2 className="text-sm font-bold mb-3">{workout.menu}</h2>
              <div className="space-y-3">
                {workout.sets.map((set, index) => (
                  <div
                    key={set.id}
                    className="flex items-center p-3 rounded-md bg-muted/30"
                  >
                    <div className="font-medium text-xs w-16 text-center">
                      セット {index + 1}
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {workout.type === "weight" ? (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              重量
                            </p>
                            <p className="font-medium text-xs">
                              {set.weight} {workout.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              回数
                            </p>
                            <p className="font-medium text-xs">{set.reps}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              距離
                            </p>
                            <p className="font-medium">
                              {set.distance} {workout.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              時間
                            </p>
                            <p className="font-medium">{set.time}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {workout.memo && (
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <p className="text-xs">{workout.memo}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
