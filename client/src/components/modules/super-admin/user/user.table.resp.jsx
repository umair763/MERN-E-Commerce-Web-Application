import { UiStatusPill, ActionButtons } from "../../../../common";

export const UserTableResp = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{user.contact || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {user.roles?.map(role => role.name).join(', ') || '-'}
            </td>
            <td className="px-6 py-4">
              <UiStatusPill
                status={user.status}
                color={user.status === 'active' ? '#059669' : '#DC2626'}
              />
            </td>
            <td className="px-6 py-4 text-right">
              <ActionButtons
                showView={false}
                showEdit={true}
                showDelete={true}
                onEdit={() => onEdit?.(user)}
                onDelete={() => onDelete?.(user)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};