import { UiStatusPill, ActionButtons } from "../../../../common";

export const PermissionTable = ({ permissions, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {permissions.map((permission) => (
          <tr key={permission._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-900">{permission.key}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{permission.module}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{permission.action}</td>
            <td className="px-6 py-4">
              <UiStatusPill
                status={permission.isActive ? 'Active' : 'Inactive'}
                color={permission.isActive ? '#059669' : '#DC2626'}
              />
            </td>
            <td className="px-6 py-4 text-right">
              <ActionButtons
                showView={false}
                showEdit={true}
                showDelete={true}
                onEdit={() => onEdit?.(permission)}
                onDelete={() => onDelete?.(permission)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
