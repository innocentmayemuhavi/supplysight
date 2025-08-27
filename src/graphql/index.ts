import { gql } from '@apollo/client';

// Queries
export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilter, $limit: Int, $offset: Int) {
    products(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      sku
      warehouse
      stock
      demand
      status
    }
  }
`;

export const GET_WAREHOUSES = gql`
  query GetWarehouses {
    warehouses
  }
`;

export const GET_CATEGORY_DATA = gql`
  query GetCategoryData {
    categories {
      name
      value
      color
      percentage
    }
  }
`;

export const GET_ALERTS = gql`
  query GetAlerts($limit: Int) {
    alerts(limit: $limit) {
      id
      type
      message
      severity
      timestamp
      productId
      warehouseId
      read
    }
  }
`;

export const GET_KPIS = gql`
  query GetKPIs($range: DateRange!) {
    kpis(range: $range) {
      totalStock
      totalDemand
      fillRate
      trend {
        date
        stock
        demand
      }
    }
  }
`;

// Mutations
export const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      name
      sku
      warehouse
      stock
      demand
      status
    }
  }
`;

export const TRANSFER_STOCK = gql`
  mutation TransferStock(
    $id: ID!
    $fromWarehouse: String!
    $toWarehouse: String!
    $quantity: Int!
  ) {
    transferStock(
      id: $id
      fromWarehouse: $fromWarehouse
      toWarehouse: $toWarehouse
      quantity: $quantity
    ) {
      id
      name
      sku
      warehouse
      stock
      demand
      status
    }
  }
`;