import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Plus } from "lucide-react";
import { PermissionTable, PermissionCreateDialogue, PermissionEditDialogue } from "../permission";
import { UiDelete } from "../../../../common";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminPermissions = () => {
  const { success, error } = useToast();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

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

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setShowEdit(true);
  };

  const handleDelete = (permission) => {
    setSelectedPermission(permission);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/permissions/${selectedPermission._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        success("Permission deleted successfully");
        fetchPermissions();
        setShowDelete(false);
        setSelectedPermission(null);
      } else {
        error("Failed to delete permission");
      }
    } catch (err) {
      error("Failed to delete permission");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchPermissions();
    success("Permission created successfully");
  };

  const handleEditSuccess = () => {
    setShowEdit(false);
    setSelectedPermission(null);
    fetchPermissions();
    success("Permission updated successfully");
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Permissions"]}
          title="Permissions"
          subtitle="Manage system permissions"
          buttonLabel="Add Permission"
          buttonIcon={Plus}
          showButton={true}
          onButtonClick={() => setShowCreate(true)}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <PermissionTable
            permissions={permissions}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <PermissionCreateDialogue
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      {showEdit && selectedPermission && (
        <PermissionEditDialogue
          isOpen={showEdit}
          permission={selectedPermission}
          onClose={() => {
            setShowEdit(false);
            setSelectedPermission(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDelete && selectedPermission && (
        <UiDelete
          open={showDelete}
          onClose={() => {
            setShowDelete(false);
            setSelectedPermission(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Permission"
          itemType="permission"
          itemName={selectedPermission.key}
        />
      )}
    </div>
  );
};
