import { useState } from "react";
import { X, Package, Warehouse, AlertCircle } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import type { Product } from "../../models";
import { Status } from "../../models";
import { UPDATE_DEMAND, TRANSFER_STOCK } from "../../graphql";

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  warehouses: string[];
  onUpdate: () => void;
}

const ProductDrawer = ({
  product,
  isOpen,
  onClose,
  warehouses,
  onUpdate,
}: ProductDrawerProps) => {
  const [updateDemand] = useMutation(UPDATE_DEMAND);
  const [transferStock] = useMutation(TRANSFER_STOCK);

  const [demandValue, setDemandValue] = useState("");
  const [transferQuantity, setTransferQuantity] = useState("");
  const [targetWarehouse, setTargetWarehouse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset form when product changes
  useState(() => {
    if (product) {
      setDemandValue(product.demand.toString());
      setTransferQuantity("");
      setTargetWarehouse("");
    }
  });

  if (!isOpen || !product) return null;

  const handleUpdateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateDemand({
        variables: {
          id: product.id,
          demand: parseInt(demandValue),
        },
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating demand:", error);
      alert("Failed to update demand. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !targetWarehouse || isUpdating) return;

    setIsUpdating(true);
    try {
      await transferStock({
        variables: {
          id: product.id,
          fromWarehouse: product.warehouse,
          toWarehouse: targetWarehouse,
          quantity: parseInt(transferQuantity),
        },
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error transferring stock:", error);
      alert("Failed to transfer stock. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case Status.HEALTHY:
        return {
          label: "🟢 Healthy",
          className: "text-green-600 bg-green-50",
          icon: "✅",
        };
      case Status.LOW:
        return {
          label: "🟡 Low Stock",
          className: "text-yellow-600 bg-yellow-50",
          icon: "⚠️",
        };
      case Status.CRITICAL:
        return {
          label: "🔴 Critical",
          className: "text-red-600 bg-red-50",
          icon: "❌",
        };
      default:
        return {
          label: status,
          className: "text-gray-600 bg-gray-50",
          icon: "❓",
        };
    }
  };

  const statusConfig = getStatusConfig(product.status);
  const availableWarehouses = warehouses.filter((w) => w !== product.warehouse);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 px-6 py-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Warehouse className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Warehouse
                    </p>
                    <p className="text-sm text-gray-500">{product.warehouse}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Stock</p>
                    <p className="text-xl font-bold text-blue-600">
                      {product.stock.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">
                      Demand
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      {product.demand.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${statusConfig.className}`}>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{statusConfig.label}</span>
                  </div>
                  <p className="text-sm mt-1">
                    {product.status === Status.HEALTHY &&
                      "Stock levels are sufficient"}
                    {product.status === Status.LOW &&
                      "Stock equals demand - monitor closely"}
                    {product.status === Status.CRITICAL &&
                      "Stock below demand - immediate action required"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Demand
              </h3>
              <form onSubmit={handleUpdateDemand} className="space-y-4">
                <div>
                  <label
                    htmlFor="demand"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Demand
                  </label>
                  <input
                    type="number"
                    id="demand"
                    min="0"
                    value={demandValue}
                    onChange={(e) => setDemandValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    isUpdating ||
                    !demandValue ||
                    parseInt(demandValue) === product.demand
                  }
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Updating..." : "Update Demand"}
                </button>
              </form>
            </div>
            {availableWarehouses.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Transfer Stock
                </h3>
                <form onSubmit={handleTransferStock} className="space-y-4">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantity to Transfer
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={transferQuantity}
                      onChange={(e) => setTransferQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {product.stock}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="warehouse"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      To Warehouse
                    </label>
                    <select
                      id="warehouse"
                      value={targetWarehouse}
                      onChange={(e) => setTargetWarehouse(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select warehouse...</option>
                      {availableWarehouses.map((warehouse) => (
                        <option key={warehouse} value={warehouse}>
                          {warehouse}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isUpdating || !transferQuantity || !targetWarehouse
                    }
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdating ? "Transferring..." : "Transfer Stock"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDrawer;
