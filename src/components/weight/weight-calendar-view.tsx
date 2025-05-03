"use client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { weightCalendarDataList } from "@/types/weight";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface WeightCalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  weightData: weightCalendarDataList;
}

export function WeightCalendarView({
  selectedDate,
  onSelectDate,
  weightData,
}: WeightCalendarViewProps) {
  return (
    <div className="space-y-6">
      {selectedDate && (
        <Card>
          <CardContent className="px-6">
            <div className="space-y-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  {format(selectedDate, "yyyy年MM月dd日", { locale: ja })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, "EEEE", { locale: ja })}
                </p>
              </div>
              {weightData[format(selectedDate, "yyyy-MM-dd")] ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold">
                      {weightData[format(selectedDate, "yyyy-MM-dd")].weight}kg
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Body Fat</p>
                    <p className="text-2xl font-bold">
                      {weightData[format(selectedDate, "yyyy-MM-dd")].fat}%
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No data recorded
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onSelectDate(date)}
            className="w-full"
            locale={ja}
            formatters={{
              formatCaption: (date) => {
                return format(date, "yyyy年 M月", { locale: ja });
              },
            }}
            classNames={{
              months:
                "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
              month: "space-y-4 w-full flex flex-col",
              caption:
                "flex justify-center pt-1 relative items-center text-sm font-medium",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm relative p-0 w-full",
              day: "h-full w-full hover:bg-accent hover:text-accent-foreground rounded-md",
              day_selected:
                "bg-primary hover:bg-primary focus:bg-primary text-primary-foreground hover:text-primary-foreground focus:text-primary-foreground [&_.weight-data]:!text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "rounded-none",
              day_hidden: "invisible",
            }}
            modifiers={{
              hasWeight:
                weightData &&
                Object.keys(weightData).map((date) => new Date(date)),
            }}
            modifiersStyles={{
              hasWeight: {
                fontWeight: "bold",
              },
            }}
            components={{
              DayContent: ({ date }) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const data = weightData[dateStr];
                const isSelected =
                  dateStr === format(selectedDate, "yyyy-MM-dd");
                return (
                  <div className="h-14 w-full flex flex-col items-center justify-start py-1">
                    <span className="text-sm mb-1">{date.getDate()}</span>
                    {data && (
                      <div className="weight-data text-[0.65rem] leading-tight text-center">
                        <div
                          className={`text-primary font-medium mb-0.5 ${
                            isSelected && "text-white"
                          }`}
                        >
                          {data.weight}Kg
                        </div>
                        <div
                          className={`text-muted-foreground ${
                            isSelected && "text-white/80"
                          }`}
                        >
                          {data.fat}%
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
