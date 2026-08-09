export const AuditTableResp = ({ logs, loading }) => {
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (logs.length === 0) {
    return <div className="p-6 text-center text-gray-500">No audit logs found</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {log.user?.name || 'System'} 
                <span className="text-gray-500 text-xs ml-2">({log.user?.email || 'N/A'})</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 capitalize">{log.action}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{log.entity}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{formatDate(log.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
