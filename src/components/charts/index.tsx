import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TrendData } from "../../models";

interface StockDemandChartProps {
  data: TrendData[];
  loading: boolean;
}

const StockDemandChart = ({ data, loading }: StockDemandChartProps) => {
  if (loading) {
    return (
      <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg border border-[#f2f4f7] p-6 mb-8">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // Format data for display
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white  backdrop-blur-sm rounded-xl  border border-gray-200/50  hover:shadow-sm transition-all duration-300">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
        Stock vs Demand Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Stock"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="Demand"
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockDemandChart;
