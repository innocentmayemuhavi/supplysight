import { Package, TrendingUp, Target } from "lucide-react";
import { KpiCard } from "../cards";

interface KPIs {
  totalStock: number;
  totalDemand: number;
  fillRate: number;
}

interface KpiCardProps {
  kpis?: KPIs;
  loading?: boolean;
}
const KPICards = ({ kpis, loading = false }: KpiCardProps) => {
  const defaultKpis: KPIs = {
    totalStock: 0,
    totalDemand: 0,
    fillRate: 0,
  };
  const currentKpis = kpis || defaultKpis;

  const kpiItems = [
    {
      title: "Total Stock",
      value: currentKpis.totalStock.toLocaleString(),
      description: "Sum of all stock levels",
      icon: Package,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Demand",
      value: currentKpis.totalDemand.toLocaleString(),
      description: "Sum of all demand",
      icon: TrendingUp,
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Fill Rate",
      value: `${currentKpis.fillRate.toFixed(1)}%`,
      description: "Percentage of demand fulfilled",
      icon: Target,
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiItems.map((kpi, index) => (
        <KpiCard key={index} kpi={kpi} />
      ))}
    </div>
  );
};

export default KPICards;
