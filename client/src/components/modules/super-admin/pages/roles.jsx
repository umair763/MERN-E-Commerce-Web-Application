import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Plus } from "lucide-react";
import { RoleTable, RoleCreateDialogue, RoleEditDialogue } from "../role";
import { UiDelete } from "../../../../common";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminRoles = () => {
  const { success, error } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

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

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowEdit(true);
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/roles/${selectedRole._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        success("Role deleted successfully");
        fetchRoles();
        setShowDelete(false);
        setSelectedRole(null);
      } else {
        error("Failed to delete role");
      }
    } catch (err) {
      error("Failed to delete role");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchRoles();
    success("Role created successfully");
  };

  const handleEditSuccess = () => {
    setShowEdit(false);
    setSelectedRole(null);
    fetchRoles();
    success("Role updated successfully");
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Roles"]}
          title="Roles"
          subtitle="Manage system roles"
          buttonLabel="Add Role"
          buttonIcon={Plus}
          showButton={true}
          onButtonClick={() => setShowCreate(true)}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <RoleTable
            roles={roles}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <RoleCreateDialogue
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      {showEdit && selectedRole && (
        <RoleEditDialogue
          isOpen={showEdit}
          role={selectedRole}
          onClose={() => {
            setShowEdit(false);
            setSelectedRole(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDelete && selectedRole && (
        <UiDelete
          open={showDelete}
          onClose={() => {
            setShowDelete(false);
            setSelectedRole(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Role"
          itemType="role"
          itemName={selectedRole.name}
        />
      )}
    </div>
  );
};
