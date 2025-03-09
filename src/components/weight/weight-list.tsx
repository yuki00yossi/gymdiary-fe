import { WeightListItem } from "@/components/weight/weight-list-item";
import { weightDataList } from "@/types/weight";

interface WeightListProps {
  WeightData: weightDataList;
}

export function WeightList({ WeightData }: WeightListProps) {
  return (
    <div className="space-y-4">
      {WeightData.length &&
        WeightData.map((record) => (
          <WeightListItem key={record.id} record={record} />
        ))}
    </div>
  );
}
