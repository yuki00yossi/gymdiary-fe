import { WeightListItem } from "@/components/weight/weight-list-item";

// Mock data - replace with real data from your backend
// const weightData = [
//   {
//     id: "1",
//     date: "2024-02-23",
//     weight: 73.5,
//     bodyFat: 18.2,
//     note: "Morning weight after breakfast",
//   },
//   {
//     id: "2",
//     date: "2024-02-22",
//     weight: 73.8,
//     bodyFat: 18.5,
//   },
//   {
//     id: "3",
//     date: "2024-02-21",
//     weight: 74.0,
//     bodyFat: 18.7,
//     note: "Feeling good today",
//   },
//   {
//     id: "4",
//     date: "2024-02-20",
//     weight: 74.2,
//   },
//   {
//     id: "5",
//     date: "2024-02-19",
//     weight: 74.5,
//     bodyFat: 19.0,
//   },
// ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function WeightList({ WeightData }) {
  return (
    <div className="space-y-4">
      {WeightData.length &&
        WeightData.map((record) => (
          <WeightListItem key={record.id} record={record} />
        ))}
    </div>
  );
}
