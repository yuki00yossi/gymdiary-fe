"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, LineChart } from "lucide-react";
import { WeightList } from "@/components/weight/weight-list";
import { WeightCalendarView } from "@/components/weight/weight-calendar-view";
import { WeightChartView } from "@/components/weight/weight-chart-view";
import { WeightFormModal } from "@/components/weight/weight-form-modal";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AnimatedPage } from "@/components/animated-page";
import { useAuth } from "@/lib/AuthContext";
import { ja } from "date-fns/locale";

type ViewMode = "calendar" | "chart";

export default function WeightPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { apiFetch } = useAuth();
  const [weightData, setWeightData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    fetchWeights();
  }, []);

  const _setCalendarData = (data) => {
    const formatedData = {};

    for (let i = 0; i < data.length; i++) {
      const date = format(data[i].record_date, "yyyy-MM-dd", { locale: ja });
      formatedData[date] = {
        weight: data[i].weight,
        bodyFat: data[i].fat,
      };
    }

    setCalendarData(formatedData);
    // console.log(formatedData);
  };

  const fetchWeights = async () => {
    const weightURL = import.meta.env.VITE_API_ROOT + "/weight/";
    const res = await apiFetch(weightURL);
    const data = await res.json();
    setWeightData(data);
    console.log(data);

    _setCalendarData(data);
  };

  return (
    <AnimatedPage>
      <div className="p-4 h-full w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">体重管理</h1>

          <div className="flex w-full">
            <Button
              onClick={() => setShowWeightModal(true)}
              className="bg-primary hover:bg-primary/90 cursor-pointer ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              体重記録
            </Button>
          </div>

          <div className="w-full flex items-center rounded-lg border bg-card p-1 text-card-foreground">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative h-8 rounded-md px-3 w-[100%]",
                viewMode === "calendar" && "bg-muted"
              )}
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            {/* 一旦チャートは無効にする */}
            {/* <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative h-8 rounded-md px-3 w-[50%]",
                viewMode === "chart" && "bg-muted"
              )}
              onClick={() => setViewMode("chart")}
            >
              <LineChart className="mr-2 h-4 w-4" />
              Chart
            </Button> */}
          </div>
        </div>

        <div className="space-y-6">
          {viewMode === "calendar" ? (
            <WeightCalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              weightData={calendarData}
            />
          ) : (
            <WeightChartView />
          )}
          <WeightList WeightData={weightData} />
        </div>

        <WeightFormModal
          open={showWeightModal}
          onOpenChange={setShowWeightModal}
          defaultDate={selectedDate}
        />
      </div>
    </AnimatedPage>
  );
}
