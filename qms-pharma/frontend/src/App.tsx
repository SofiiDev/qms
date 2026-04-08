import { useEffect, type FormEvent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { setAuthToken } from './api/client';
import { useAuth } from './auth/useAuth';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { DesviosPage } from './modules/desvios/DesviosPage';
import { CambiosPage } from './modules/cambios/CambiosPage';
import { RiesgosPage } from './modules/riesgos/RiesgosPage';
import { DocumentosPage } from './modules/documentos/DocumentosPage';
import { CapasPage } from './modules/capas/CapasPage';
import { AiAssistant } from './components/AiAssistant';
import { AuditTrail } from './components/AuditTrail';

function LoginPage(): JSX.Element {
  const { login } = useAuth();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await login(String(form.get('email')), String(form.get('password')));
  };

  return (
    <form className="mx-auto mt-20 max-w-md space-y-2 rounded bg-white p-4 shadow" onSubmit={onSubmit}>
      <h1 className="text-xl font-bold">Login QMS Pharma</h1>
      <input name="email" className="w-full rounded border p-2" type="email" required />
      <input name="password" className="w-full rounded border p-2" type="password" required />
      <button className="rounded bg-blue-700 px-3 py-2 text-white" type="submit">Ingresar</button>
    </form>
  );
}

function Layout(): JSX.Element {
  const { token, logout } = useAuth();

  useEffect(() => { setAuthToken(token); }, [token]);

  return (
    <div className="min-h-screen p-4">
      <nav className="mb-4 flex gap-3 rounded bg-white p-3 shadow">
        <Link to="/desvios">Desvíos</Link><Link to="/cambios">Cambios</Link><Link to="/riesgos">Riesgos</Link><Link to="/documentos">Documentos</Link><Link to="/capas">CAPAs</Link><Link to="/audit">Audit</Link><button onClick={() => void logout()} className="ml-auto">Salir</button>
      </nav>
      <Routes>
        <Route path="/desvios" element={<DesviosPage />} />
        <Route path="/cambios" element={<CambiosPage />} />
        <Route path="/riesgos" element={<RiesgosPage />} />
        <Route path="/documentos" element={<DocumentosPage />} />
        <Route path="/capas" element={<CapasPage />} />
        <Route path="/audit" element={<AuditTrail />} />
        <Route path="/ai" element={<AiAssistant />} />
        <Route path="*" element={<Navigate to="/desvios" replace />} />
      </Routes>
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
    </Routes>
  );
}
