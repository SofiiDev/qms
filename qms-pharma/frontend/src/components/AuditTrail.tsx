import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export function AuditTrail(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['audit'],
    queryFn: async () => (await apiClient.get('/api/audit')).data,
  });

  return (
    <div className="rounded border bg-white p-4 shadow">
      <h2 className="mb-2 font-semibold">Audit Trail</h2>
      <div className="space-y-2">
        {(data ?? []).map((log: any) => (
          <div key={log.id} className="rounded border p-2 text-sm">
            <div>{log.timestamp} - {log.module} - {log.action}</div>
            <div className="text-slate-600">Usuario: {log.user?.email ?? 'sistema'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
