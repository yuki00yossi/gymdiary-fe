import { format } from "date-fns";
import { Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeightRecord {
  id: string;
  record_date: string;
  weight: number;
  fat?: number;
  created_at: string;
  updated_at?: string;
}

interface WeightListItemProps {
  record: WeightRecord;
}

export function WeightListItem({ record }: WeightListItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {format(new Date(record.record_date), "yyyy/MM/dd")}
            </p>
            <div className="flex gap-4">
              <p className="text-2xl font-bold">{record.weight}kg</p>
              {record.fat && (
                <p className="text-2xl text-muted-foreground">{record.fat}%</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
