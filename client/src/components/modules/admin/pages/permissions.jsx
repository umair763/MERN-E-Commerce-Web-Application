import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Plus } from "lucide-react";
import { PermissionTable } from "../permission";

const BaseUrl = import.meta.env.VITE_API_URL;

export const AdminPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/permissions`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setPermissions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Permissions"]}
          title="Permissions"
          subtitle="Manage system permissions"
          buttonLabel="Add Permission"
          buttonIcon={Plus}
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <PermissionTable permissions={permissions} loading={loading} />
        </div>
      </div>
    </div>
  );
};
