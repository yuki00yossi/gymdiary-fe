import { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Plus, PenLine } from "lucide-react";
import { AnimatedPage } from "@/components/animated-page";
import ApiClient from "@/lib/ApiClient";
import { NavLink } from "react-router";
import { MealData } from "@/types/meal";

// モックデータ
const mockData = {
  calories: {
    consumed: 0,
    remaining: 0,
    target: 0,
  },
  nutrients: {
    carbs: { current: 0, target: 0 },
    protein: { current: 0, target: 0 },
    fat: { current: 0, target: 0 },
  },
  meals: [
    { id: 1, name: "朝食", calories: 0, consumed: 0, progress: 0 },
    { id: 2, name: "昼食", calories: 0, consumed: 0, progress: 0 },
    { id: 4, name: "夕食", calories: 0, consumed: 0, progress: 0 },
  ],
};

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  type?: "main" | "meal";
  calories?: { consumed: number; total: number };
}

function CircularProgress({
  progress,
  size = 40,
  strokeWidth = 4,
  type = "meal",
  calories,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="stroke-primary transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset.toString()}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {type === "main" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-muted-foreground">残り</div>
          <div className="text-xl font-bold">
            {Math.ceil(calories?.total! - calories?.consumed!)}
          </div>
          <div className="text-sm text-muted-foreground">kcal</div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">{Math.ceil(progress)}%</span>
        </div>
      )}
    </div>
  );
}

function CaloriesSummary({
  consumed,
  target,
}: {
  consumed: number;
  target: number;
}) {
  return (
    <div className="flex px-5 items-center justify-between mb-6">
      <div className="text-center">
        <div className="text-sm text-muted-foreground">摂取</div>
        <div className="text-sm font-bold">{consumed}kcal</div>
      </div>
      <div className="">
        <CircularProgress
          progress={Math.round((consumed / target) * 100)}
          size={120}
          strokeWidth={12}
          type="main"
          calories={{
            consumed: consumed,
            total: target,
          }}
        />
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">目標</div>
        <div className="text-sm font-bold">{target}kcal</div>
      </div>
    </div>
  );
}

export default function MealsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealData, setMealData] = useState<MealData>(mockData);

  const handlePrevDay = () => setSelectedDate((prev) => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate((prev) => addDays(prev, 1));

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    fetchMealData();
  }, [selectedDate]);

  const fetchMealData = async () => {
    const res = await ApiClient.get(
      `${import.meta.env.VITE_API_ROOT}/meal/?date=${format(
        selectedDate,
        "yyyy-MM-dd"
      )}`
    );
    const data: MealData = {
      calories: {
        consumed: 0,
        remaining: 0,
        target: 2000,
      },
      nutrients: {
        carbs: { current: 0, target: 200 },
        protein: { current: 0, target: 200 },
        fat: { current: 0, target: 200 },
      },
      meals: [],
    };

    let totalCalories = 0;

    for (let i = 0; i < res.data.length; i++) {
      let carories = 0;

      for (let j = 0; j < res.data[i].meal_items.length; j++) {
        const meal_item = res.data[i].meal_items[j];
        carories += meal_item.meal_item.calories;
        data.nutrients.carbs.current += meal_item.meal_item.carbs;
        data.nutrients.fat.current += meal_item.meal_item.fat;
        data.nutrients.protein.current += meal_item.meal_item.protein;
      }

      data.meals.push({
        id: res.data[i].id,
        name: res.data[i].time_of_day,
        calories: 500,
        consumed: carories,
        progress: (carories / 500) * 100,
      });

      totalCalories += carories;
    }

    data.calories.consumed = totalCalories;

    setMealData(data);
  };

  return (
    <AnimatedPage>
      <div className="container max-w-md mx-auto p-4 space-y-4">
        {/* 日付ナビゲーション */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-medium">
            {isToday
              ? "今日"
              : format(selectedDate, "M月d日(E)", { locale: ja })}
          </h1>
          <Button variant="ghost" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* サマリー */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
          <h2 className="font-medium mb-4">サマリー</h2>
          <CaloriesSummary
            consumed={mealData.calories.consumed}
            target={mealData.calories.target}
          />
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <div className="text-sm text-center">
                <span>炭水化物</span>
              </div>
              <Progress
                value={
                  (mealData.nutrients.carbs.current /
                    mealData.nutrients.carbs.target) *
                  100
                }
                className="h-2 mb-0"
              />
              <span className="text-sm text-muted-foreground text-center">
                {mealData.nutrients.carbs.current} /{" "}
                {mealData.nutrients.carbs.target}g
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-center">
                <span>タンパク質</span>
              </div>
              <Progress
                value={
                  (mealData.nutrients.protein.current /
                    mealData.nutrients.protein.target) *
                  100
                }
                className="h-2 mb-0"
              />
              <span className="text-sm text-muted-foreground text-center">
                {mealData.nutrients.protein.current} /{" "}
                {mealData.nutrients.protein.target}g
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-center">
                <span>脂質</span>
              </div>
              <Progress
                value={
                  (mealData.nutrients.fat.current /
                    mealData.nutrients.fat.target) *
                  100
                }
                className="h-2 mb-0"
              />
              <span className="text-sm text-muted-foreground text-center">
                {mealData.nutrients.fat.current} /{" "}
                {mealData.nutrients.fat.target}g
              </span>
            </div>
          </div>
        </Card>

        {/* 食事リスト */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">セット</h2>
            <Button variant="ghost" size="icon">
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {mealData.meals.map((meal) => (
              <NavLink key={meal.id} to={`/meals/${meal.id}`}>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <CircularProgress
                      progress={meal.progress}
                      size={48}
                      strokeWidth={4}
                    />
                    <div>
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {meal.consumed} / {meal.calories}kcal
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </NavLink>
            ))}
            <Button asChild className="w-full mt-5 text-white">
              <NavLink to="/meals/add">食事を記録</NavLink>
            </Button>
          </div>
        </Card>

        {/* トレーナーコメント */}
        <Card className="p-4 bg-gradient-to-r from-orange-600 to-orange-400 text-white">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <PenLine className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-medium">トレーナーコメント</h2>
              <p className="text-sm">
                いいバランスの食事ができていますね！
                朝食をもしっかり食べられるようになるともっと良いですね。
                この調子で明日もタンパク質を意識していきましょう。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
}
