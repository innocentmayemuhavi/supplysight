import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import type {
  DashboardState,
  Product,
  KPIs,
  CategoryData,
  AlertData,
  ProductFilter,
  DateRange,
  PaginationInfo,
} from "../models";

interface ExtendedDashboardState extends DashboardState {
  kpis: KPIs | null;
  products: Product[];
  warehouses: string[];
  categories: CategoryData[];
  alerts: AlertData[];
  loading: {
    kpis: boolean;
    products: boolean;
    warehouses: boolean;
    categories: boolean;
    alerts: boolean;
  };
  errors: {
    kpis: string | null;
    products: string | null;
    warehouses: string | null;
    categories: string | null;
    alerts: string | null;
  };
}

// Action Types
type DashboardAction =
  | { type: "SET_DATE_RANGE"; payload: DateRange }
  | { type: "SET_FILTERS"; payload: ProductFilter }
  | { type: "SET_PAGINATION"; payload: Partial<PaginationInfo> }
  | { type: "SET_SELECTED_PRODUCT"; payload: Product | null }
  | { type: "TOGGLE_DRAWER" }
  | {
      type: "SET_KPIS";
      payload: { kpis: KPIs | null; loading: boolean; error: string | null };
    }
  | {
      type: "SET_PRODUCTS";
      payload: { products: Product[]; loading: boolean; error: string | null };
    }
  | {
      type: "SET_WAREHOUSES";
      payload: { warehouses: string[]; loading: boolean; error: string | null };
    }
  | {
      type: "SET_CATEGORIES";
      payload: {
        categories: CategoryData[];
        loading: boolean;
        error: string | null;
      };
    }
  | {
      type: "SET_ALERTS";
      payload: { alerts: AlertData[]; loading: boolean; error: string | null };
    };

// Initial State
const initialState: ExtendedDashboardState = {
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
  kpis: null,
  products: [],
  warehouses: [],
  categories: [],
  alerts: [],
  loading: {
    kpis: false,
    products: false,
    warehouses: false,
    categories: false,
    alerts: false,
  },
  errors: {
    kpis: null,
    products: null,
    warehouses: null,
    categories: null,
    alerts: null,
  },
};

// Reducer
const dashboardReducer = (
  state: ExtendedDashboardState,
  action: DashboardAction
): ExtendedDashboardState => {
  switch (action.type) {
    case "SET_DATE_RANGE":
      return { ...state, selectedDateRange: action.payload };

    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
        pagination: { ...state.pagination, currentPage: 1 },
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case "SET_SELECTED_PRODUCT":
      return { ...state, selectedProduct: action.payload };

    case "TOGGLE_DRAWER":
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    case "SET_KPIS":
      return {
        ...state,
        kpis: action.payload.kpis,
        loading: { ...state.loading, kpis: action.payload.loading },
        errors: { ...state.errors, kpis: action.payload.error },
      };

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        loading: { ...state.loading, products: action.payload.loading },
        errors: { ...state.errors, products: action.payload.error },
      };

    case "SET_WAREHOUSES":
      return {
        ...state,
        warehouses: action.payload.warehouses,
        loading: { ...state.loading, warehouses: action.payload.loading },
        errors: { ...state.errors, warehouses: action.payload.error },
      };

    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload.categories,
        loading: { ...state.loading, categories: action.payload.loading },
        errors: { ...state.errors, categories: action.payload.error },
      };

    case "SET_ALERTS":
      return {
        ...state,
        alerts: action.payload.alerts,
        loading: { ...state.loading, alerts: action.payload.loading },
        errors: { ...state.errors, alerts: action.payload.error },
      };

    default:
      return state;
  }
};

// Context
const DashboardContext = createContext<{
  state: ExtendedDashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  refetchAll: () => Promise<void>;
} | null>(null);

// Provider Component
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories: CategoryData[] = [];

    const mockAlerts: AlertData[] = [];

    dispatch({
      type: "SET_CATEGORIES",
      payload: { categories: mockCategories, loading: false, error: null },
    });

    dispatch({
      type: "SET_ALERTS",
      payload: { alerts: mockAlerts, loading: false, error: null },
    });
  }, []);

  const refetchAll = async () => {
    try {
      toast.success("All data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh some data");
    }
  };

  return (
    <DashboardContext.Provider value={{ state, dispatch, refetchAll }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

const AppContext = DashboardContext;
const AppProvider = DashboardProvider;

export { AppContext, AppProvider };
export default DashboardContext;
