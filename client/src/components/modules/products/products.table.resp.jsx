import { ActionMenu } from "../../../common/action.menu.jsx";
import { UiStatusPill } from "../../../common/ui.status.phill.jsx";

const COLUMNS = [
  { key: "number", label: "#" },
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
];

const ROW_ACTIONS = [
  { key: "edit", label: "Edit", variant: "filled" },
  { key: "delete", label: "Delete", variant: "danger" },
];

export const ProductsTableResp = ({ products, onEdit, onDelete }) => {
  return (
    <div className="min-h-screen w-full p-2 text-gray-900">
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs uppercase text-gray-500"
                  >
                    {column.label}
                  </th>
                ))}

                <th className="w-24 px-6 py-4 text-center text-xs uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product, index) => (
                <tr key={product._id} className="transition hover:bg-indigo-50/50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>

                  <td className="px-6 py-4">
                    <UiStatusPill
                      status={product.category?.name || "Uncategorized"}
                      color="#4F30A9"
                    />
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    ${product.price}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.stock}
                  </td>

                  <td className="px-6 py-4">
                    <UiStatusPill
                      status={product.status || "Active"}
                      color={product.status?.toLowerCase() === "active" ? "#10B981" : "#EF4444"}
                    />
                  </td>

                  <td className="w-24 px-6 py-4">
                    <div className="flex w-full justify-center">
                      <ActionMenu
                        actions={ROW_ACTIONS}
                        onAction={(actionKey) => {
                          if (actionKey === "edit") onEdit(product);
                          if (actionKey === "delete") onDelete(product);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
