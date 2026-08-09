import { UiStatusPill } from "../../../common/ui.status.phill.jsx";

const COLUMNS = [
  { key: "number", label: "#" },
  { key: "code", label: "Code" },
  { key: "type", label: "Type" },
  { key: "value", label: "Value" },
  { key: "minOrder", label: "Min Order" },
  { key: "status", label: "Status" },
];

export const CouponsTableResp = ({ coupons }) => {
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
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {coupons.map((coupon, index) => (
                <tr key={coupon._id} className="transition hover:bg-indigo-50/50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>

                  <td className="px-6 py-4">
                    <UiStatusPill
                      status={coupon.type || "percent"}
                      color="#4F30A9"
                    />
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${coupon.minOrder || 0}
                  </td>

                  <td className="px-6 py-4">
                    <UiStatusPill
                      status={coupon.isActive ? "Active" : "Inactive"}
                      color={coupon.isActive ? "#10B981" : "#EF4444"}
                    />
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
