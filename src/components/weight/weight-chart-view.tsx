import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { WeightChart } from "@/components/weight/weight-chart";

export function WeightChartView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WeightChart />
      </CardContent>
    </Card>
  );
}
