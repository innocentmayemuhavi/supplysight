import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/index.tsx";
import { AppProvider } from "./context/index.tsx";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

// Determine GraphQL server URL based on environment
const getGraphQLUri = () => {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    return "http://localhost:4000";
  }

  return import.meta.env.VITE_GRAPHQL_URI || "http://localhost:4000";
};

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Dashboard />} />
    </>
  )
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: getGraphQLUri(),
  }),
});

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <ApolloProvider client={client}>
      <StrictMode>
        <RouterProvider router={routes} />
      </StrictMode>
    </ApolloProvider>
  </AppProvider>
);
