import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import ApiClient from "@/lib/ApiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronLeft, Minus, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatedPage } from "@/components/animated-page";
import { useParams } from "react-router";

const weightFormSchema = z.object({
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "無効な日付です。",
  }),
  memo: z.string().optional().nullable(),
  workouts: z.array(
    z.object({
      menu: z.string().min(1, "種目名を入力してください"),
      type: z.enum(["weight", "distance"]),
      unit: z.string(),
      memo: z.string().optional().nullable(),
      sets: z.array(
        z.object({
          weight: z.coerce
            .number()
            .min(0, "0以上の値を入力してください")
            .optional(),
          reps: z.coerce
            .number()
            .min(0, "0以上の値を入力してください")
            .optional(),
          distance: z.coerce
            .number()
            .min(0, "0以上の値を入力してください")
            .optional(),
          time: z.string().nullable().optional(),
          memo: z.string().optional().nullable(),
        })
      ),
    })
  ),
});

type FormValues = z.infer<typeof weightFormSchema>;

export default function TrainingEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  // const [record, setRecord] = useState<TrainingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(weightFormSchema),
    mode: "onBlur",
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      memo: "",
      workouts: [],
    },
  });

  const { fields: workoutFields, append: appendWorkout } = useFieldArray({
    name: "workouts",
    control: form.control,
  });

  useEffect(() => {
    const fetchTrainingInfo = async () => {
      try {
        const res = await ApiClient.get(
          import.meta.env.VITE_API_ROOT + "/training/" + params.id
        );

        form.reset({
          date: format(new Date(res.data.date), "yyyy-MM-dd"),
          workouts: res.data.workouts.map((workout: any) => ({
            ...workout,
            sets: workout.sets || [],
          })),
          memo: res.data.memo,
        });

        setLoading(false);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
        setLoading(false);
      }
    };

    fetchTrainingInfo();
  }, [params.id, form.reset]);

  async function onSubmit(data: FormValues) {
    await ApiClient.post(import.meta.env.VITE_API_ROOT + "/training/", data);
  }

  if (loading) {
    return (
      <AnimatedPage>
        <div className="p-4 w-full md:container md:mx-auto md:p-6">
          <p>ロード中...</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">トレ編集</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>日付</FormLabel>
                      <Input type="date" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {workoutFields.map((workoutField, workoutIndex) => (
              <WorkoutCard
                key={workoutField.id}
                workoutIndex={workoutIndex}
                form={form}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendWorkout({
                  menu: "",
                  type: "weight",
                  unit: "kg",
                  sets: [],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              トレーニングを追加
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>メモ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>トレーニングの総括をしよう！</p>
                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel></FormLabel>
                      <Textarea>{field.value}</Textarea>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/training/${params.id}`)}
              >
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </Form>
      </div>
    </AnimatedPage>
  );
}

// 📌 別コンポーネントに分離することで hooks の順番がずれないようにする
function WorkoutCard({
  workoutIndex,
  form,
}: {
  workoutIndex: number;
  form: any;
}) {
  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
  } = useFieldArray({
    control: form.control,
    name: `workouts.${workoutIndex}.sets`,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>トレーニング {workoutIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name={`workouts.${workoutIndex}.menu`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>種目名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`workouts.${workoutIndex}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイプ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="タイプを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight">ウェイト</SelectItem>
                  <SelectItem value="distance">有酸素</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <h4 className="text-sm font-medium">セット</h4>
        {setFields.map((setField, setIndex) => (
          <Card key={setField.id}>
            <CardHeader className="w-full flex flex-row items-center">
              <div>{setIndex + 1}セット目</div>
              <div className="ml-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => removeSet(setIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 py-0 text-right">
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name={`workouts.${workoutIndex}.sets.${setIndex}.weight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>重量 (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workouts.${workoutIndex}.sets.${setIndex}.reps`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>回数</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`workouts.${workoutIndex}.sets.${setIndex}.memo`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>メモ</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => appendSet({ weight: 0, reps: 0 })}
        >
          <Plus className="h-4 w-4 mr-2" />
          セットを追加
        </Button>
        <FormField
          control={form.control}
          name={`workouts.${workoutIndex}.memo`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>メモ</FormLabel>
              <p>セット全体で感じた事メモしよう！</p>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
