"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, LineChart } from "lucide-react";
import { WeightList } from "@/components/weight/weight-list";
import { WeightCalendarView } from "@/components/weight/weight-calendar-view";
import { WeightChartView } from "@/components/weight/weight-chart-view";
import { WeightFormModal } from "@/components/weight/weight-form-modal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedPage } from "@/components/animated-page";

type ViewMode = "calendar" | "chart";

export default function WeightPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">Weight History</h1>
          <div className="w-full sm:w-auto flex gap-4 items-center">
            <div className="inline-flex items-center rounded-lg border bg-card p-1 text-card-foreground">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative h-8 rounded-md px-3",
                  viewMode === "calendar" && "bg-muted"
                )}
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative h-8 rounded-md px-3",
                  viewMode === "chart" && "bg-muted"
                )}
                onClick={() => setViewMode("chart")}
              >
                <LineChart className="mr-2 h-4 w-4" />
                Chart
              </Button>
            </div>
            <Button onClick={() => setShowWeightModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record Weight
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {viewMode === "calendar" ? (
            <WeightCalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          ) : (
            <WeightChartView />
          )}
          <WeightList />
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
