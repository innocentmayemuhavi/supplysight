export interface Product {
    id: string;
    name: string;
    sku: string;
    warehouse: string;
    stock: number;
    demand: number;
    status: Status;
    category: string;
    supplier: string;
    lastRestocked: string;
    unitPrice: number;
    totalValue: number;
    reorderPoint: number;
    velocity: number;
    location: string;
}

export const Status = {
    HEALTHY: 'HEALTHY',
    LOW: 'LOW',
    CRITICAL: 'CRITICAL',
} as const;

export type Status = typeof Status[keyof typeof Status];

export const DateRange = {
    SEVEN_DAYS: 'SEVEN_DAYS',
    FOURTEEN_DAYS: 'FOURTEEN_DAYS',
    THIRTY_DAYS: 'THIRTY_DAYS',

} as const;

export type DateRange = typeof DateRange[keyof typeof DateRange];

export interface TrendData {
    date: string;
    stock: number;
    demand: number;
}

export interface KPIs {
    totalStock: number;
    totalDemand: number;
    fillRate: number;
    trend: TrendData[];
    stockTurnover: number;
    avgLeadTime: number;
    totalValue: number;
    lowStockItems: number;
    perfectOrders: number;
    warehouseUtilization: number;
}

export interface ProductFilter {
    search?: string;
    warehouse?: string;
    status?: Status;
}

export interface PaginationInfo {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}


export interface DashboardState {
    selectedDateRange: DateRange;
    filters: ProductFilter;
    pagination: PaginationInfo;
    selectedProduct: Product | null;
    isDrawerOpen: boolean;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

export interface MetricCard {
    title: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    icon: string;
    color: string;
    format: 'number' | 'percentage' | 'currency';
}

export interface AlertData {
    id: string;
    type: 'STOCK_OUT' | 'LOW_STOCK' | 'OVERSTOCK' | 'DELIVERY_DELAY' | 'QUALITY_ISSUE';
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: string;
    productId?: string;
    warehouseId?: string;
    read: boolean;
}

// GraphQL Response Types
export interface GetProductsResponse {
    products: Product[];
}

export interface GetWarehousesResponse {
    warehouses: string[];
}

export interface GetKPIsResponse {
    kpis: KPIs;
}

export interface GetCategoryDataResponse {
    categories: CategoryData[];
}

export interface GetAlertsResponse {
    alerts: AlertData[];
}

export interface ProductDrawerProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}