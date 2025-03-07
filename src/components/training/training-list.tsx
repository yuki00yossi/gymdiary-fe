import { TrainingListItem } from "@/components/training/training-list-item";
import type { TrainingRecord } from "@/types/training";

interface TrainingListProps {
  trainingData: TrainingRecord[];
}

// TrainingListをReact.FCとして定義
const TrainingList: React.FC<TrainingListProps> = ({ trainingData }) => {
  if (trainingData.length === 0) {
    return <p className="text-gray-500 text-center">データがありません。</p>;
  }

  return (
    <div className="space-y-4">
      {trainingData.map((record) => (
        <TrainingListItem key={record.id} record={record} />
      ))}
    </div>
  );
};

export default TrainingList;
