import { ActionButtons } from "../../../../common";

export const SettingsTableResp = ({ settings, loading, onEdit }) => {
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (settings.length === 0) {
    return <div className="p-6 text-center text-gray-500">No settings found</div>;
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {settings.map((setting) => (
          <tr key={setting.key} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{setting.key}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {typeof setting.value === 'object' 
                ? JSON.stringify(setting.value) 
                : String(setting.value)}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{setting.description || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {new Date(setting.updatedAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-right">
              <ActionButtons
                showView={false}
                showEdit={true}
                showDelete={false}
                onEdit={() => onEdit?.(setting)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
