import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

// Sample data
const products = [
  {
    id: "P-1001",
    name: "12mm Hex Bolt",
    sku: "HEX-12-100",
    warehouse: "BLR-A",
    stock: 180,
    demand: 120,
  },
  {
    id: "P-1002",
    name: "Steel Washer",
    sku: "WSR-08-500",
    warehouse: "BLR-A",
    stock: 50,
    demand: 80,
  },
  {
    id: "P-1003",
    name: "M8 Nut",
    sku: "NUT-08-200",
    warehouse: "PNQ-C",
    stock: 80,
    demand: 80,
  },
  {
    id: "P-1004",
    name: "Bearing 608ZZ",
    sku: "BRG-608-50",
    warehouse: "DEL-B",
    stock: 24,
    demand: 120,
  },
  {
    id: "P-1005",
    name: "Spring Steel",
    sku: "SPR-05-100",
    warehouse: "BLR-A",
    stock: 200,
    demand: 150,
  },
  {
    id: "P-1006",
    name: "Rubber Gasket",
    sku: "GSK-10-250",
    warehouse: "PNQ-C",
    stock: 30,
    demand: 90,
  },
  {
    id: "P-1007",
    name: "Aluminum Rod",
    sku: "ALU-20-50",
    warehouse: "DEL-B",
    stock: 120,
    demand: 60,
  },
  {
    id: "P-1008",
    name: "Steel Pipe",
    sku: "PIP-15-200",
    warehouse: "BLR-A",
    stock: 75,
    demand: 75,
  },
];

// Generate mock trend data for different date ranges
const generateTrendData = (days) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));

    // Generate realistic stock and demand trends
    const baseStock = products.reduce((sum, p) => sum + p.stock, 0);
    const baseDemand = products.reduce((sum, p) => sum + p.demand, 0);

    const stockVariation = Math.sin(i * 0.1) * 50 + Math.random() * 30 - 15;
    const demandVariation = Math.cos(i * 0.15) * 40 + Math.random() * 25 - 12;

    data.push({
      date: date.toISOString().split("T")[0],
      stock: Math.max(0, Math.round(baseStock + stockVariation)),
      demand: Math.max(0, Math.round(baseDemand + demandVariation)),
    });
  }
  return data;
};

// GraphQL schema
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
    status: Status!
  }

  enum Status {
    HEALTHY
    LOW
    CRITICAL
  }

  enum DateRange {
    SEVEN_DAYS
    FOURTEEN_DAYS
    THIRTY_DAYS
  }

  type TrendData {
    date: String!
    stock: Int!
    demand: Int!
  }

  type KPIs {
    totalStock: Int!
    totalDemand: Int!
    fillRate: Float!
    trend: [TrendData!]!
  }

  input ProductFilter {
    search: String
    warehouse: String
    status: Status
  }

  type Query {
    products(filter: ProductFilter, limit: Int, offset: Int): [Product!]!
    warehouses: [String!]!
    kpis(range: DateRange!): KPIs!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(
      id: ID!
      fromWarehouse: String!
      toWarehouse: String!
      quantity: Int!
    ): Product!
  }
`;

// Resolvers
const resolvers = {
  Product: {
    status: (product) => {
      if (product.stock > product.demand) return "HEALTHY";
      if (product.stock === product.demand) return "LOW";
      return "CRITICAL";
    },
  },
  Query: {
    products: (_, { filter, limit = 10, offset = 0 }) => {
      let filtered = [...products];

      if (filter) {
        if (filter.search) {
          const search = filter.search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(search) ||
              p.sku.toLowerCase().includes(search) ||
              p.id.toLowerCase().includes(search)
          );
        }

        if (filter.warehouse) {
          filtered = filtered.filter((p) => p.warehouse === filter.warehouse);
        }

        if (filter.status) {
          filtered = filtered.filter((p) => {
            const status =
              p.stock > p.demand
                ? "HEALTHY"
                : p.stock === p.demand
                ? "LOW"
                : "CRITICAL";
            return status === filter.status;
          });
        }
      }

      return filtered.slice(offset, offset + limit);
    },
    warehouses: () => {
      const warehouses = [...new Set(products.map((p) => p.warehouse))];
      return warehouses.sort();
    },
    kpis: (_, { range }) => {
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const totalDemand = products.reduce((sum, p) => sum + p.demand, 0);
      const filledDemand = products.reduce(
        (sum, p) => sum + Math.min(p.stock, p.demand),
        0
      );
      const fillRate = totalDemand > 0 ? (filledDemand / totalDemand) * 100 : 0;

      let days;
      switch (range) {
        case "SEVEN_DAYS":
          days = 7;
          break;
        case "FOURTEEN_DAYS":
          days = 14;
          break;
        case "THIRTY_DAYS":
          days = 30;
          break;
        default:
          days = 7;
      }

      return {
        totalStock,
        totalDemand,
        fillRate: Math.round(fillRate * 100) / 100,
        trend: generateTrendData(days),
      };
    },
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      product.demand = demand;
      return product;
    },
    transferStock: (_, { id, fromWarehouse, toWarehouse, quantity }) => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }

      // For simplicity, just update the stock
      // In a real system, this would involve more complex logic
      if (product.warehouse === fromWarehouse) {
        product.stock = Math.max(0, product.stock - quantity);
      }

      return product;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res }),
});

export default handler;
