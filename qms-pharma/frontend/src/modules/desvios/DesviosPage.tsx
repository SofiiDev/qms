import { useQuery } from '@tanstack/react-query';
import { modulesApi } from '../../api/endpoints/modules';

const loader = {
  desvios: modulesApi.listDesvios,
  cambios: modulesApi.listCambios,
  riesgos: modulesApi.listRiesgos,
  documentos: modulesApi.listDocumentos,
  capas: modulesApi.listCapas,
}['desvios'];

export function DesviosPage(): JSX.Element {
  const { data, isLoading } = useQuery({ queryKey: ['desvios'], queryFn: loader });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="rounded border bg-white p-4 shadow">
      <h1 className="mb-3 text-xl font-bold capitalize">desvios</h1>
      <pre className="overflow-auto rounded bg-slate-100 p-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
