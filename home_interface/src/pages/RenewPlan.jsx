import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const RenewPlan = () => {
  const navigate = useNavigate();
  const { renewPlan, loading } = useAuth();
  const { showToast } = useToast();
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Renovar plano - Calculadora de Sensibilidade';
  }, []);

  const handleRenew = async () => {
    setErro('');
    setIsLoading(true);
    try {
      await renewPlan();
      showToast('Plano renovado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErro('Erro ao renovar plano. Tente novamente.');
      showToast('Erro ao renovar plano. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <main className="home-main card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 19.5 19 18M19 6l1.5-1.5M6 19l-1.5 1.5"
                stroke="#7ed2ff"
                strokeWidth="2"
              />
              <path d="M8 12a4 4 0 108 0 4 4 0 10-8 0Z" stroke="#00ffe7" strokeWidth="2" />
            </svg>
            Renovar plano
          </h2>
          <p className="subtitle" style={{ marginBottom: 16 }}>
            Seu plano expirou. Toque em ‘Renovar plano’ para continuar usando o app.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn" onClick={handleRenew} disabled={isLoading || loading}>
              {isLoading ? 'Renovando...' : 'Renovar plano'}
            </button>
            <button className="btn ghost" onClick={() => navigate('/')}>
              Voltar
            </button>
          </div>
          {erro && (
            <div
              className="home-warning"
              style={{ marginTop: 12 }}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              {erro}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RenewPlan;
