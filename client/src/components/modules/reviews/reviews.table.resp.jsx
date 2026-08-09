import { ActionMenu } from "../../../common/action.menu.jsx";
import { UiStatusPill } from "../../../common/ui.status.phill.jsx";
import { Star } from "lucide-react";

const COLUMNS = [
  { key: "number", label: "#" },
  { key: "user", label: "User" },
  { key: "product", label: "Product" },
  { key: "rating", label: "Rating" },
  { key: "comment", label: "Comment" },
];

const ROW_ACTIONS = [
  { key: "delete", label: "Delete", variant: "danger" },
];

export const ReviewsTableResp = ({ reviews, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="min-h-screen w-full p-2 text-gray-900">
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="p-6 text-center text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen w-full p-2 text-gray-900">
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="p-6 text-center text-gray-500">No reviews found</div>
        </div>
      </div>
    );
  }

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
              {reviews.map((review, index) => (
                <tr key={review._id} className="transition hover:bg-indigo-50/50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {review.user?.name || "Unknown"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {review.product?.name || "Unknown Product"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">{review.rating}</span>
                      <span className="text-sm text-gray-500">/5</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {review.comment || "-"}
                  </td>

                  <td className="w-24 px-6 py-4">
                    <div className="flex w-full justify-center">
                      <ActionMenu
                        actions={ROW_ACTIONS}
                        onAction={(actionKey) => {
                          if (actionKey === "delete") onDelete(review);
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