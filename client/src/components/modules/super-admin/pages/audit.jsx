import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { AuditTableResp } from "../audit";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });
  const [filter, setFilter] = useState({ action: '', entity: '' });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...(filter.action && { action: filter.action }),
        ...(filter.entity && { entity: filter.entity }),
      });
      
      const response = await fetch(`${BaseUrl}/api/audit-logs?${queryParams}`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setLogs(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [filter]);

  const handlePageChange = (newPage) => {
    fetchLogs(newPage);
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Audit Logs"]}
          title="Audit Logs"
          subtitle="View system activity logs"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Filter by Action</label>
              <input
                type="text"
                placeholder="e.g., create, update, delete"
                value={filter.action}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Filter by Entity</label>
              <input
                type="text"
                placeholder="e.g., User, Product, Order"
                value={filter.entity}
                onChange={(e) => setFilter({ ...filter, entity: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <AuditTableResp logs={logs} loading={loading} />

          {pagination.pages > 1 && !loading && logs.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
