const KpiCard = ({ kpi }: { kpi: any }) => {
  const IconComponent = kpi.icon;

  return (
    <div>
      <div
        className={`bg-white border-2 ${kpi.borderColor} rounded-xl p-6 hover:shadow-sm transition-all duration-200 hover:scale-102 cursor-pointer`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
            <IconComponent className={`w-6 h-6 ${kpi.textColor}`} />
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{kpi.title}</h3>
          <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
          <p className="text-sm text-gray-500">{kpi.description}</p>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
