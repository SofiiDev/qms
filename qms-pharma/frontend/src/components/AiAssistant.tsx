import { useState } from 'react';
import DOMPurify from 'dompurify';
import { apiClient } from '../api/client';

export function AiAssistant(): JSX.Element {
  const [module, setModule] = useState('desvios');
  const [action, setAction] = useState('analizar');
  const [context, setContext] = useState('{}');
  const [answer, setAnswer] = useState('');

  const onSubmit = async () => {
    const sanitizedAction = DOMPurify.sanitize(action);
    const parsedContext = JSON.parse(context);
    const { data } = await apiClient.post('/api/ai/assist', { module, action: sanitizedAction, context: parsedContext });
    setAnswer(data.answer);
  };

  return (
    <div className="rounded border bg-white p-4 shadow">
      <h2 className="mb-2 font-semibold">Asistente IA</h2>
      <input className="mb-2 w-full rounded border p-2" value={module} onChange={(e) => setModule(e.target.value)} placeholder="Módulo" />
      <input className="mb-2 w-full rounded border p-2" value={action} onChange={(e) => setAction(e.target.value)} placeholder="Acción" />
      <textarea className="mb-2 w-full rounded border p-2" rows={4} value={context} onChange={(e) => setContext(e.target.value)} />
      <button className="rounded bg-blue-700 px-3 py-2 text-white" onClick={onSubmit}>Consultar</button>
      {answer ? <pre className="mt-3 whitespace-pre-wrap rounded bg-slate-100 p-2">{answer}</pre> : null}
    </div>
  );
}
