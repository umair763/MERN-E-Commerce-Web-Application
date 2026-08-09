import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Plus } from "lucide-react";
import { UserTableResp, UserCreateDialogue, UserEditDialogue } from "../user";
import { UiDelete } from "../../../../common";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminUsers = () => {
  const { success, error } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/users`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/users/${selectedUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        success("User deleted successfully");
        fetchUsers();
        setShowDelete(false);
        setSelectedUser(null);
      } else {
        error("Failed to delete user");
      }
    } catch (err) {
      error("Failed to delete user");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchUsers();
    success("User created successfully");
  };

  const handleEditSuccess = () => {
    setShowEdit(false);
    setSelectedUser(null);
    fetchUsers();
    success("User updated successfully");
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Users"]}
          title="Users"
          subtitle="Manage system users"
          buttonLabel="Add User"
          buttonIcon={Plus}
          showButton={true}
          onButtonClick={() => setShowCreate(true)}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <UserTableResp
            users={users}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <UserCreateDialogue
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      {showEdit && selectedUser && (
        <UserEditDialogue
          isOpen={showEdit}
          user={selectedUser}
          onClose={() => {
            setShowEdit(false);
            setSelectedUser(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDelete && selectedUser && (
        <UiDelete
          open={showDelete}
          onClose={() => {
            setShowDelete(false);
            setSelectedUser(null);
          }}
          onConfirm={confirmDelete}
          title="Delete User"
          itemType="user"
          itemName={selectedUser.name}
        />
      )}
    </div>
  );
};