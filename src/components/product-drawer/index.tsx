import { useState, useEffect } from "react";
import { X, Package, Edit, ArrowRightLeft, MapPin } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-hot-toast";
import type { ProductDrawerProps } from "../../models";
import { GET_WAREHOUSES, UPDATE_DEMAND, TRANSFER_STOCK } from "../../graphql";
import { getStatusColor } from "../../utils";

// GraphQL mutations

const ProductDrawer = ({
  product,
  isOpen,
  onClose,
  onRefresh,
}: ProductDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "demand" | "transfer">(
    "details"
  );
  const [demandValue, setDemandValue] = useState(product?.demand || 0);
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [toWarehouse, setToWarehouse] = useState("");

  // Update state when product changes
  useEffect(() => {
    if (product) {
      setDemandValue(product.demand || 0);
      setTransferQuantity(0);
      setToWarehouse("");
      setActiveTab("details");
    }
  }, [product]);

  // Fetch warehouses
  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  // GraphQL mutations
  const [updateDemand, { loading: updatingDemand }] = useMutation(
    UPDATE_DEMAND,
    {
      onCompleted: () => {
        toast.success("Demand updated successfully!");
        onRefresh?.();
      },
      onError: (error) => {
        toast.error(`Failed to update demand: ${error.message}`);
      },
    }
  );

  const [transferStock, { loading: transferringStock }] = useMutation(
    TRANSFER_STOCK,
    {
      onCompleted: () => {
        toast.success("Stock transferred successfully!");
        onRefresh?.();
        setTransferQuantity(0);
        setToWarehouse("");
      },
      onError: (error) => {
        toast.error(`Failed to transfer stock: ${error.message}`);
      },
    }
  );

  const handleUpdateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await updateDemand({
        variables: {
          id: product.id,
          demand: demandValue,
        },
      });
    } catch (error) {
      console.error("Update demand error:", error);
    }
  };

  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !toWarehouse || transferQuantity <= 0) return;

    try {
      await transferStock({
        variables: {
          id: product.id,
          fromWarehouse: product.warehouse,
          toWarehouse,
          quantity: transferQuantity,
        },
      });
    } catch (error) {
      console.error("Transfer stock error:", error);
    }
  };

  if (!product) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/5 backdrop-blur-[10px] z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-2 top-2 bottom-2 w-full max-[750px]:top-0 max-[750px]:bottom-0 max-[750px]:right-0
  max-w-[500px] bg-white shadow-sm z-50 transform transition-transform duration-300 ease-in-out rounded-2xl ${
    isOpen ? "translate-x-0" : "translate-x-full"
  }`}
      >
        <div
          className={`flex flex-col h-full ${isOpen ? "animate-fade-in" : ""}`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500">ID: {product.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "details"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("demand")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "demand"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Update Demand
            </button>
            <button
              onClick={() => setActiveTab("transfer")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "transfer"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 inline mr-2" />
              Transfer Stock
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {product.sku}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <p className="text-gray-900">{product.category}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Warehouse
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {product.warehouse}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier
                      </label>
                      <p className="text-gray-900">{product.supplier}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <p className="text-gray-900">{product.location}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">
                      Current Stock
                    </h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {product.stock ? product.stock.toLocaleString() : "0"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-700 mb-2">
                      Demand
                    </h4>
                    <p className="text-2xl font-bold text-green-900">
                      {product.demand ? product.demand.toLocaleString() : "0"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "demand" && (
              <form onSubmit={handleUpdateDemand} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Update Product Demand
                  </h3>
                  <div>
                    <label
                      htmlFor="demand"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Demand Quantity
                    </label>
                    <input
                      type="number"
                      id="demand"
                      value={demandValue}
                      onChange={(e) =>
                        setDemandValue(parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new demand"
                      min="0"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={updatingDemand}
                  className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updatingDemand ? "Updating..." : "Update Demand"}
                </button>
              </form>
            )}

            {activeTab === "transfer" && (
              <form onSubmit={handleTransferStock} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transfer Stock
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Warehouse
                      </label>
                      <input
                        type="text"
                        value={product.warehouse}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="toWarehouse"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        To Warehouse
                      </label>
                      <select
                        id="toWarehouse"
                        value={toWarehouse}
                        onChange={(e) => setToWarehouse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        required
                      >
                        <option value="">
                          Select destination warehouse...
                        </option>
                        {((warehousesData as any)?.warehouses || [])
                          .filter(
                            (warehouse: string) =>
                              warehouse !== product.warehouse
                          )
                          .map((warehouse: string) => (
                            <option key={warehouse} value={warehouse}>
                              {warehouse}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Quantity to Transfer
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={transferQuantity}
                        onChange={(e) =>
                          setTransferQuantity(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter quantity"
                        min="1"
                        max={product.stock || 0}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Available:{" "}
                        {product.stock ? product.stock.toLocaleString() : "0"}{" "}
                        units
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={
                    transferringStock || !toWarehouse || transferQuantity <= 0
                  }
                  className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {transferringStock ? "Transferring..." : "Transfer Stock"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDrawer;
