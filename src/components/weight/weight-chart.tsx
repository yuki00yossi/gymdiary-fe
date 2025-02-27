import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data
const data = [
  { date: "1/1", weight: 75 },
  { date: "1/8", weight: 74.5 },
  { date: "1/15", weight: 74.2 },
  { date: "1/22", weight: 73.8 },
  { date: "1/29", weight: 73.5 },
];

export function WeightChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip formatter={(value) => [`${value}kg`, "Weight"]} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
