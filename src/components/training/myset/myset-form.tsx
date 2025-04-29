import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { MySetDetail } from "@/types/myset";
import { createMySet, updateMySet } from "@/lib/api/myset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Minus, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "react-router";

// バリデーションスキーマ
const setSchema = z.object({
  weight: z.number().optional(),
  reps: z.number().optional(),
  distance: z.number().optional(),
  time: z.string().optional(),
  memo: z.string().optional(),
});

const workoutSchema = z.object({
  menu: z.string().min(1, "種目名は必須です"),
  type: z.enum(["weight", "distance"]),
  unit: z.string().min(1, "単位は必須です"),
  memo: z.string().optional(),
  sets: z.array(setSchema).min(1, "少なくとも1セット必要です"),
});

const mySetSchema = z.object({
  name: z.string().min(1, "セット名は必須です"),
  workouts: z.array(workoutSchema).min(1, "少なくとも1種目必要です"),
});

type FormValues = z.infer<typeof mySetSchema>;

interface MySetFormProps {
  initialData?: MySetDetail;
  isEditing?: boolean;
}

export function MySetForm({ initialData, isEditing = false }: MySetFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォームの初期化
  const form = useForm<FormValues>({
    resolver: zodResolver(mySetSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          workouts: initialData.workouts.map((workout) => ({
            menu: workout.menu,
            type: workout.type,
            unit: workout.unit,
            memo: workout.memo,
            sets: workout.sets.map((set) => ({
              weight: set.weight ?? undefined,
              reps: set.reps ?? undefined,
              distance: set.distance ?? undefined,
              time: set.time ?? "",
              memo: set.memo ?? "",
            })),
          })),
        }
      : {
          name: "",
          workouts: [
            {
              menu: "",
              type: "weight",
              unit: "kg",
              sets: [
                {
                  weight: 0,
                  reps: 10,
                },
              ],
            },
          ],
        },
  });

  // ワークアウトのフィールド配列
  const {
    fields: workoutFields,
    append: appendWorkout,
    remove: removeWorkout,
  } = useFieldArray({
    control: form.control,
    name: "workouts",
  });

  // フォーム送信処理
  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        await updateMySet(initialData.id, data);
        toast("成功", {
          description: "マイセットを更新しました",
        });
      } else {
        await createMySet(data);
        toast.success("成功", {
          description: "マイセットを更新しました",
        });
      }
      navigate("/training/myset");
    } catch (error) {
      toast.error("エラー", {
        description: isEditing
          ? "マイセットの更新に失敗しました"
          : "マイセットの作成に失敗しました",
      });
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-lg font-bold">
          {isEditing ? "マイセットを編集" : "マイセットを作成"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder="例: 胸トレ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">種目</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendWorkout({
                  menu: "",
                  type: "weight",
                  unit: "kg",
                  sets: [
                    {
                      weight: 0,
                      reps: 10,
                    },
                  ],
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              種目を追加
            </Button>
          </div>
          {workoutFields.map((workoutField, workoutIndex) => {
            return (
              <WorkoutCard
                key={workoutField.id}
                workoutIndex={workoutIndex}
                form={form}
                removeWorkout={removeWorkout}
                workoutFields={workoutFields}
              />
            );
          })}

          {workoutFields.length === 0 && (
            <div className="text-center p-4 border rounded-lg">
              <p className="text-muted-foreground">
                種目がまだ追加されていません
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendWorkout({
                    menu: "",
                    type: "weight",
                    unit: "kg",
                    sets: [
                      {
                        weight: 0,
                        reps: 10,
                      },
                    ],
                  })
                }
                className="mt-2"
              >
                <Plus className="mr-1 h-4 w-4" />
                種目を追加
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "保存中..." : isEditing ? "更新する" : "保存する"}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}

interface WorkoutCardProps {
  workoutIndex: number;
  form: any;
  removeWorkout: (index: number) => void;
  workoutFields: any[];
}

function WorkoutCard({
  workoutIndex,
  form,
  removeWorkout,
  workoutFields,
}: WorkoutCardProps) {
  const setsPath = `workouts.${workoutIndex}.sets`;
  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
  } = useFieldArray({
    control: form.control,
    name: setsPath,
  });

  return (
    <motion.div
      key={workoutIndex}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <FormField
              control={form.control}
              name={`workouts.${workoutIndex}.menu`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>種目名</FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs"
                      placeholder="例: ベンチプレス"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {workoutFields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeWorkout(workoutIndex)}
              className="text-destructive h-8 px-2"
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`workouts.${workoutIndex}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイプ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="タイプを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="text-xs" value="weight">
                        重量
                      </SelectItem>
                      <SelectItem className="text-xs" value="distance">
                        距離
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`workouts.${workoutIndex}.unit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>単位</FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs"
                      placeholder="例: kg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">セット</h4>
              <Button
                type="button"
                variant="outline"
                className="text-xs"
                size="sm"
                onClick={() => {
                  const type = form.getValues(`workouts.${workoutIndex}.type`);
                  if (type === "weight") {
                    appendSet({
                      weight: 0,
                      reps: 10,
                    });
                  } else {
                    appendSet({
                      distance: 0,
                      time: "00:00",
                    });
                  }
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                セット追加
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              {setFields.map((setField, setIndex) => {
                const type = form.watch(`workouts.${workoutIndex}.type`);

                return (
                  <motion.div
                    key={setField.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-3 rounded-md bg-muted/50"
                  >
                    <div className="font-medium text-xs w-16 text-center">
                      セット {setIndex + 1}
                    </div>

                    <div className="grid grid-cols-2 gap-2 flex-1">
                      {type === "weight" ? (
                        <>
                          <FormField
                            control={form.control}
                            name={`${setsPath}.${setIndex}.weight`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-xs">重量</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    {...field}
                                    className="h-6 text-xs"
                                    onChange={(e) => {
                                      console.log(Number(e.target.value));
                                      e.target.value = Number(
                                        e.target.value
                                      ).toString();
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`${setsPath}.${setIndex}.reps`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-xs">回数</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    className="h-6 text-xs"
                                    onChange={(e) => {
                                      e.target.value = Number(
                                        e.target.value
                                      ).toString();
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <FormField
                            control={form.control}
                            name={`${setsPath}.${setIndex}.distance`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-xs">距離</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    {...field}
                                    className="h-8"
                                    onChange={(e) => {
                                      e.target.value = Number(
                                        e.target.value
                                      ).toString();
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`${setsPath}.${setIndex}.time`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-xs">時間</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="00:00"
                                    {...field}
                                    className="h-8"
                                    value={field.value || ""}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>

                    {setFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSet(setIndex)}
                        className="text-destructive h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {setFields.length === 0 && (
              <div className="text-center p-4 border rounded-lg">
                <p className="text-muted-foreground">
                  セットがまだ追加されていません
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const type = form.getValues(
                      `workouts.${workoutIndex}.type`
                    );
                    if (type === "weight") {
                      appendSet({
                        weight: 0,
                        reps: 10,
                      });
                    } else {
                      appendSet({
                        distance: 0,
                        time: "00:00",
                      });
                    }
                  }}
                  className="mt-2"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  セット追加
                </Button>
              </div>
            )}
            <FormField
              control={form.control}
              name={`workouts.${workoutIndex}.memo`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ (任意)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="種目に関するメモ..."
                      className="text-xs"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
