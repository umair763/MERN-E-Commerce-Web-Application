import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { UserTableResp } from "../user";

const BaseUrl = import.meta.env.VITE_API_URL;

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/users`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        const allUsers = result.data;
        const customers = allUsers.filter(user => 
          user.roles?.some(role => role.name === 'customer')
        );
        setUsers(customers);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Users"]}
          title="Users"
          subtitle="Manage system users"
          buttonLabel="Add User"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <UserTableResp users={users} loading={loading} />
        </div>
      </div>
    </div>
  );
};