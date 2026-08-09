import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Plus } from "lucide-react";
import { RoleTable } from "../role";

const BaseUrl = import.meta.env.VITE_API_URL;

export const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/roles`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setRoles(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Roles"]}
          title="Roles"
          subtitle="Manage system roles"
          buttonLabel="Add Role"
          buttonIcon={Plus}
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <RoleTable roles={roles} loading={loading} />
        </div>
      </div>
    </div>
  );
};
