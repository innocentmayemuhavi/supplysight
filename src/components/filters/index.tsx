import { Search, ChevronDown } from "lucide-react";
import type { ProductFilter, Status } from "../../models";
import { Status as StatusEnum } from "../../models";

interface FiltersProps {
  filters: ProductFilter;
  warehouses: string[];
  onFiltersChange: (filters: ProductFilter) => void;
  loading?: boolean;
}

const Filters = ({
  filters,
  warehouses,
  onFiltersChange,
  loading = false,
}: FiltersProps) => {
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Healthy", value: StatusEnum.HEALTHY },
    { label: "Low", value: StatusEnum.LOW },
    { label: "Critical", value: StatusEnum.CRITICAL },
  ];

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const handleWarehouseChange = (warehouse: string) => {
    onFiltersChange({ ...filters, warehouse: warehouse || undefined });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: (status as Status) || undefined });
  };

  return (
    <div className="bg-white backdrop-blur-sm rounded-xl border border-[#f2f4f7] p-6 mb-2 hover:shadow-sm transition-all duration-300 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, SKU, or ID..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={loading}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <select
            value={filters.warehouse || ""}
            onChange={(e) => handleWarehouseChange(e.target.value)}
            disabled={loading}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse} value={warehouse}>
                {warehouse}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <select
            value={filters.status || ""}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={loading}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
