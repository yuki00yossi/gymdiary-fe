import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { AnimatedPage } from "@/components/animated-page";
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
import ApiClient from "@/lib/ApiClient";
import { MealDetail } from "@/types/meal";

// 栄養素の目標値（1日あたり）
const nutritionGoals = {
  calories: 2200,
  protein: 110, // g
  fat: 73, // g
  carbs: 275, // g
};

export default function MealDetailPage() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const res = await ApiClient.get(
          import.meta.env.VITE_API_ROOT + `/meal/${mealId}/`
        );
        const mealData: MealDetail = {
          id: res.data.id,
          date: res.data.date,
          timeOfDay: res.data.time_of_day,
          photo: res.data.photo_url,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          items: [],
        };

        console.log("meal items", res.data.meal_items);

        for (let i = 0; i < res.data.meal_items.length; i++) {
          mealData.items.push({
            id: res.data.meal_items[i].meal_item.id,
            name: res.data.meal_items[i].meal_item.name,
            quantity: res.data.meal_items[i].quantity,
            base_quantity: res.data.meal_items[i].meal_item.base_quantity,
            unit: res.data.meal_items[i].unit,
            calories: res.data.meal_items[i].meal_item.calories,
            protein: res.data.meal_items[i].meal_item.protein,
            fat: res.data.meal_items[i].meal_item.fat,
            carbs: res.data.meal_items[i].meal_item.carbs,
          });

          mealData.totalCalories +=
            (res.data.meal_items[i].quantity /
              res.data.meal_items[i].meal_item.base_quantity) *
            res.data.meal_items[i].meal_item.calories;
          mealData.totalFat +=
            (res.data.meal_items[i].quantity /
              res.data.meal_items[i].meal_item.base_quantity) *
            res.data.meal_items[i].meal_item.fat;
          mealData.totalProtein +=
            (res.data.meal_items[i].quantity /
              res.data.meal_items[i].meal_item.base_quantity) *
            res.data.meal_items[i].meal_item.protein;
          mealData.totalCarbs +=
            (res.data.meal_items[i].quantity /
              res.data.meal_items[i].meal_item.base_quantity) *
            res.data.meal_items[i].meal_item.carbs;
        }

        mealData.photo = res.data.photo_url;
        if (mealData) {
          setMeal(mealData);
        } else {
          // 食事が見つからない場合
          navigate("/meals");
          toast("エラー", {
            description: "指定された食事が見つかりませんでした",
          });
        }

        console.log(mealData);

        console.log(meal);
      } catch (error) {
        console.error("食事データの取得に失敗しました", error);
        toast("エラー", {
          description: "食事データの取得に失敗しました",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  const handleDelete = async () => {
    // 実際のアプリケーションではAPIリクエスト
    try {
      if (!meal) {
        throw new Error("食事データが見つかりませんでした。");
      }
      const url = `${import.meta.env.VITE_API_ROOT}/meal/${meal.id}/`;
      await ApiClient.delete(url);
      toast("食事記録を削除しました。", {
        description: "食事記録が正常に削除されました",
      });
      navigate("/meals");
    } catch (error) {
      console.error("食事の削除に失敗しました", error);
      toast("エラー", {
        description: "食事の削除に失敗しました",
      });
    }
  };

  if (loading || !meal) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 栄養素の割合を計算（1食あたりの目標値に対する割合）
  const mealNutritionPercentage = {
    calories: Math.min(
      100,
      Math.round((meal.totalCalories / (nutritionGoals.calories / 3)) * 100)
    ),
    protein: Math.min(
      100,
      Math.round((meal.totalProtein / (nutritionGoals.protein / 3)) * 100)
    ),
    fat: Math.min(
      100,
      Math.round((meal.totalFat / (nutritionGoals.fat / 3)) * 100)
    ),
    carbs: Math.min(
      100,
      Math.round((meal.totalCarbs / (nutritionGoals.carbs / 3)) * 100)
    ),
  };

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        {/* 基本情報 */}

        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/meals")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {meal.timeOfDay}
            </CardTitle>
            <p className="text-muted-foreground">
              {format(new Date(meal.date), "yyyy年MM月dd日 (E)", {
                locale: ja,
              })}
            </p>
          </div>
          <Badge className="bg-primary text-lg px-3 py-1">
            {meal.totalCalories}kcal
          </Badge>
        </div>

        {meal.photo && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={meal.photo || "/placeholder.svg"}
              alt={`${meal.timeOfDay}の写真`}
              className="w-full h-48 object-contain"
            />
          </div>
        )}

        {/* 栄養素サマリー */}
        <div className="space-y-4">
          <h3 className="font-semibold">栄養素</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>カロリー</span>
                <span className="text-muted-foreground">
                  {meal.totalCalories} kcal ({mealNutritionPercentage.calories}
                  %)
                </span>
              </div>
              <Progress
                value={mealNutritionPercentage.calories}
                className="h-2"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>タンパク質</span>
                <span className="text-muted-foreground">
                  {meal.totalProtein} g ({mealNutritionPercentage.protein}%)
                </span>
              </div>
              <Progress
                value={mealNutritionPercentage.protein}
                className="h-2"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>脂質</span>
                <span className="text-muted-foreground">
                  {meal.totalFat} g ({mealNutritionPercentage.fat}%)
                </span>
              </div>
              <Progress value={mealNutritionPercentage.fat} className="h-2" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>炭水化物</span>
                <span className="text-muted-foreground">
                  {meal.totalCarbs} g ({mealNutritionPercentage.carbs}%)
                </span>
              </div>
              <Progress value={mealNutritionPercentage.carbs} className="h-2" />
            </div>
          </div>
        </div>

        {/* 食品リスト */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              食品リスト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meal.items.map((item, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.base_quantity &&
                          Math.ceil(
                            (item.quantity / item.base_quantity) * item.calories
                          )}{" "}
                        kcal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        P: {item.protein}g · F: {item.fat}g · C: {item.carbs}g
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/meals/${mealId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            編集
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>食事記録を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は元に戻せません。この食事記録とそのすべてのデータが完全に削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </AnimatedPage>
  );
}
