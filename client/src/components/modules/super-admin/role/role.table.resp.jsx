import { UiStatusPill, ActionButtons } from "../../../../common";

export const RoleTable = ({ roles, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {roles.map((role) => (
          <tr key={role._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-900">{role.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{role.level}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{role.permissions?.length || 0} permissions</td>
            <td className="px-6 py-4">
              <UiStatusPill
                status={role.isActive ? 'Active' : 'Inactive'}
                color={role.isActive ? '#059669' : '#DC2626'}
              />
            </td>
            <td className="px-6 py-4 text-right">
              <ActionButtons
                showView={false}
                showEdit={true}
                showDelete={true}
                onEdit={() => onEdit?.(role)}
                onDelete={() => onDelete?.(role)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
