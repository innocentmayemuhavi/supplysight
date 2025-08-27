import { useState, useEffect } from "react";

import { toast, Toaster } from "react-hot-toast";

import Layout from "../../components/layout";

import StockDemandChart from "../../components/charts";
import Filters from "../../components/filters";
import ProductsTable from "../../components/table";
import ProductDrawer from "../../components/product-drawer";

import { GET_KPIS, GET_PRODUCTS, GET_WAREHOUSES } from "../../graphql";
import type {
  KPIs,
  Product,
  ProductFilter,
  DateRange,
  DashboardState,
} from "../../models";
import { useQuery } from "@apollo/client/react";
import KPICards from "../../components/kpis";
import { useDashboard } from "../../context";

const Dashboard = () => {
  // Get context for date range
  const { state } = useDashboard();

  // State Management
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    selectedDateRange: "THIRTY_DAYS" as DateRange,
    filters: {
      search: "",
      warehouse: "",
      status: undefined,
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 25,
      totalItems: 0,
    },
    selectedProduct: null,
    isDrawerOpen: false,
  });

  // GraphQL Queries
  const {
    data: kpisData,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKPIs,
  } = useQuery(GET_KPIS, {
    variables: { range: state.selectedDateRange },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      filter: dashboardState.filters,
      limit: dashboardState.pagination.itemsPerPage,
      offset:
        (dashboardState.pagination.currentPage - 1) *
        dashboardState.pagination.itemsPerPage,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  const { data: warehousesData, loading: warehousesLoading } = useQuery(
    GET_WAREHOUSES,
    {
      errorPolicy: "all",
    }
  );

  // Calculate KPIs from actual data
  const calculateKPIs = (products: Product[] = []): KPIs => {
    if (products.length === 0) {
      // Return mock data when no products are available
      return {
        totalStock: 1247,
        totalDemand: 845,
        fillRate: 94.5,
        trend: [],
        stockTurnover: 4.2,
        avgLeadTime: 12,
        totalValue: 2450000,
        lowStockItems: 23,
        perfectOrders: 94.5,
        warehouseUtilization: 78.5,
      };
    }

    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );
    const totalDemand = products.reduce(
      (sum, product) => sum + product.demand,
      0
    );

    // Calculate fill rate: sum(min(stock, demand)) / sum(demand) * 100%
    const filledDemand = products.reduce(
      (sum, product) => sum + Math.min(product.stock, product.demand),
      0
    );
    const fillRate = totalDemand > 0 ? (filledDemand / totalDemand) * 100 : 0;

    // Log calculations for debugging
    console.log("KPI Calculations:", {
      productsCount: products.length,
      totalStock,
      totalDemand,
      filledDemand,
      fillRate: `${fillRate.toFixed(1)}%`,
    });

    // Calculate additional metrics - using mock values since server doesn't provide unitPrice
    const totalValue = totalStock * 100; // Estimated value per unit
    const lowStockItems = products.filter(
      (product) => product.stock < product.demand
    ).length;

    return {
      totalStock,
      totalDemand,
      fillRate: Math.round(fillRate * 10) / 10, // Round to 1 decimal place
      trend: (kpisData as any)?.kpis?.trend || [],
      stockTurnover: (kpisData as any)?.kpis?.stockTurnover || 4.2,
      avgLeadTime: (kpisData as any)?.kpis?.avgLeadTime || 12,
      totalValue,
      lowStockItems,
      perfectOrders: fillRate, // Use fill rate as proxy for perfect orders
      warehouseUtilization:
        (kpisData as any)?.kpis?.warehouseUtilization || 78.5,
    };
  };

  // Get calculated KPIs
  const calculatedKPIs = calculateKPIs((productsData as any)?.products || []);

  // Event Handlers

  const handleFiltersChange = (filters: ProductFilter) => {
    setDashboardState((prev) => ({
      ...prev,
      filters,
      pagination: { ...prev.pagination, currentPage: 1 },
    }));
  };

  const handlePaginationChange = (page: number) => {
    setDashboardState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        currentPage: page,
      },
    }));
  };

  const handleProductClick = (product: Product) => {
    setDashboardState((prev) => ({
      ...prev,
      selectedProduct: product,
      isDrawerOpen: true,
    }));
    toast.success(`Selected ${product.name}`);
  };

  const handleDrawerClose = () => {
    setDashboardState((prev) => ({
      ...prev,
      selectedProduct: null,
      isDrawerOpen: false,
    }));
  };

  const handleRefreshData = async () => {
    try {
      await Promise.all([refetchKPIs(), refetchProducts()]);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    }
  };

  // Refetch data when date range changes
  useEffect(() => {
    const refetchData = async () => {
      try {
        await Promise.all([refetchKPIs(), refetchProducts()]);
        console.log(
          `Data refreshed for date range: ${state.selectedDateRange}`
        );
      } catch (error) {
        console.error("Failed to refetch data:", error);
        toast.error("Failed to update data for new date range");
      }
    };

    refetchData();
  }, [state.selectedDateRange, refetchKPIs, refetchProducts]);

  // Update total items when products data changes
  useEffect(() => {
    if (productsData) {
      setDashboardState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          totalItems:
            (productsData as any)?.totalCount ||
            (productsData as any)?.products?.length ||
            0,
        },
      }));
    }
  }, [productsData]);

  // Error Handling
  useEffect(() => {
    if (kpisError) {
      toast.error(`KPIs Error: ${kpisError.message}`);
    }
    if (productsError) {
      toast.error(`Products Error: ${productsError.message}`);
    }
  }, [kpisError, productsError]);

  // Loading states
  const isLoading = kpisLoading || productsLoading || warehousesLoading;

  return (
    <Layout>
      <div className="page flex flex-col gap-5 overflow-auto">
        <div className="bg-white rounded-lg p-3 flex flex-col gap-4 animate-fade-in">
          <div className="title-mini">Inventory KPI</div>
          <KPICards
            kpis={{
              totalStock: calculatedKPIs.totalStock,
              totalDemand: calculatedKPIs.totalDemand,
              fillRate: calculatedKPIs.fillRate,
            }}
            loading={kpisLoading || productsLoading}
          />
        </div>
        <div className="bg-white rounded-lg p-3 flex flex-col gap-4 animate-fade-in-delay-1">
          <div className="title-mini">Stock vs Demand</div>
          <StockDemandChart
            data={calculatedKPIs.trend}
            loading={kpisLoading || productsLoading}
          />
        </div>

        <div className="bg-white rounded-lg p-3 flex flex-col gap-4 animate-fade-in-delay-2">
          <div className="title-mini">Products</div>
          <Filters
            filters={dashboardState.filters}
            warehouses={(warehousesData as any)?.warehouses || []}
            loading={warehousesLoading}
            onFiltersChange={handleFiltersChange}
          />
          <ProductsTable
            products={(productsData as any)?.products || []}
            pagination={dashboardState.pagination}
            loading={isLoading}
            onProductClick={handleProductClick}
            onPaginationChange={handlePaginationChange}
          />
        </div>
        <Toaster position="top-right" reverseOrder={isLoading} />
      </div>
      <ProductDrawer
        product={dashboardState.selectedProduct}
        isOpen={dashboardState.isDrawerOpen}
        onClose={handleDrawerClose}
        onRefresh={handleRefreshData}
      />
    </Layout>
  );
};

export default Dashboard;
