import { ActionMenu } from "../../../../common/action.menu.jsx";
import { UiStatusPill } from "../../../../common/ui.status.phill.jsx";

const RETURN_STATUS_COLORS = {
  pending: "#F59E0B",
  approved: "#10B981",
  rejected: "#EF4444",
  processing: "#3B82F6",
  completed: "#8B5CF6",
};

export const ReturnsTableResp = ({ returns, onStatusUpdate }) => {
  const COLUMNS = [
    { key: "number", label: "#" },
    { key: "requestId", label: "Request ID" },
    { key: "customer", label: "Customer" },
    { key: "order", label: "Order" },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status" },
  ];

  const ROW_ACTIONS = [
    { key: "approved", label: "Approve", variant: "filled" },
    { key: "rejected", label: "Reject", variant: "danger" },
    { key: "processing", label: "Processing", variant: "outline" },
    { key: "completed", label: "Complete", variant: "outline" },
  ];

  if (returns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
        <div className="text-gray-300 mb-4">No return requests</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No return requests</h3>
        <p className="text-gray-500">Return requests will appear here</p>
      </div>
    );
  }

  return (
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
            {returns.map((returnRequest, index) => (
              <tr key={returnRequest._id} className="transition hover:bg-indigo-50/50">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {returnRequest._id.slice(-8)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>
                    <div className="font-medium">{returnRequest.user?.name}</div>
                    <div className="text-xs text-gray-500">{returnRequest.user?.email}</div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {returnRequest.order?.orderNumber || "N/A"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {returnRequest.reason}
                </td>

                <td className="px-6 py-4">
                  <UiStatusPill
                    status={returnRequest.status || "Pending"}
                    color={RETURN_STATUS_COLORS[returnRequest.status] || "#6B7280"}
                  />
                </td>

                <td className="w-24 px-6 py-4">
                  <div className="flex w-full justify-center">
                    <ActionMenu
                      actions={ROW_ACTIONS}
                      onAction={(actionKey) => {
                        if (["approved", "rejected", "processing", "completed"].includes(actionKey)) {
                          onStatusUpdate(returnRequest._id, actionKey);
                        }
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
  );
};