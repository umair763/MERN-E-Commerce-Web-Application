import { ActionMenu } from "../../../../common/action.menu.jsx";
import { UiStatusPill } from "../../../../common/ui.status.phill.jsx";

const COUPON_STATUS_COLORS = {
  active: "#10B981",
  expired: "#EF4444",
  disabled: "#6B7280",
};

export const CouponTableResp = ({ coupons, onEdit, onDelete }) => {
  const COLUMNS = [
    { key: "number", label: "#" },
    { key: "code", label: "Code" },
    { key: "type", label: "Type" },
    { key: "value", label: "Value" },
    { key: "minOrder", label: "Min Order" },
    { key: "usage", label: "Usage" },
    { key: "status", label: "Status" },
  ];

  const ROW_ACTIONS = [
    { key: "edit", label: "Edit", variant: "outline" },
    { key: "delete", label: "Delete", variant: "danger" },
  ];

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
        <div className="text-gray-300 mb-4">No coupons found</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No coupons found</h3>
        <p className="text-gray-500">Coupons will appear here</p>
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
            {coupons.map((coupon, index) => (
              <tr key={coupon._id} className="transition hover:bg-indigo-50/50">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {coupon.code}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {coupon.type}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  ${coupon.minOrder || 0}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {coupon.usageLimit ? `${coupon.used || 0}/${coupon.usageLimit}` : "Unlimited"}
                </td>

                <td className="px-6 py-4">
                  <UiStatusPill
                    status={coupon.status || "Active"}
                    color={COUPON_STATUS_COLORS[coupon.status] || "#6B7280"}
                  />
                </td>

                <td className="w-24 px-6 py-4">
                  <div className="flex w-full justify-center">
                    <ActionMenu
                      actions={ROW_ACTIONS}
                      onAction={(actionKey) => {
                        if (actionKey === "edit") onEdit(coupon);
                        if (actionKey === "delete") onDelete(coupon);
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