import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../../../common";
import { ReturnsTableResp } from "../return";
import { ActionMenu } from "../../../../common/action.menu.jsx";
import { UiStatusPill } from "../../../../common/ui.status.phill.jsx";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const AdminReturns = () => {
  const { success, error } = useToast();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}/api/returns/admin/all`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setReturns(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleStatusUpdate = async (returnId, newStatus) => {
    try {
      const response = await fetch(`${BaseUrl}/api/returns/admin/${returnId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          resolutionNote: "Updated by admin",
        }),
      });

      if (response.ok) {
        await fetchReturns();
        success("Return status updated successfully!");
      } else {
        error("Failed to update return status");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading returns...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Returns"]}
          title="Return Requests"
          subtitle="Manage product return requests"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <ReturnsTableResp returns={returns} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
};