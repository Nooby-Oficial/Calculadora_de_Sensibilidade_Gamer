import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, planoValido, loading } = useAuth();

  useEffect(() => {
    document.title = 'Calculadora de Sensibilidade - Início';
    // Só redireciona se não estiver carregando e tiver dados válidos
    if (!loading && user && planoValido) {
      navigate('/dashboard');
    }
  }, [navigate, user, planoValido, loading]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="home-container">
        <div className="home-main card">
          <p>
            <span className="spinner" />
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Verifica se tem token mas plano expirado
  const planoExpirado = user && !planoValido;

  return (
    <div className="home-container">
      <div className="container">
        <header className="home-header header">
          <span className="home-logo" style={{ display: 'inline-block' }}>
            {/* Ícone SVG gamer */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="16"
                width="48"
                height="32"
                rx="10"
                fill="#23243a"
                stroke="#00ffe7"
                strokeWidth="3"
              />
              <circle cx="22" cy="32" r="5" fill="#00ffe7" />
              <rect x="37" y="29" width="10" height="6" rx="3" fill="#00ffe7" />
              <rect x="28" y="24" width="3" height="16" rx="1.5" fill="#00ffe7" />
            </svg>
          </span>
          <h1>Calculadora de Sensibilidade</h1>
          <p className="home-subtitle subtitle">Ajuste sua sensibilidade como um profissional</p>
        </header>
        <main className="home-main card">
          <p className="subtitle" style={{ marginBottom: 12 }}>
            Bem-vindo! Acesse seu conteúdo exclusivo.
          </p>
          <div className="home-actions">
            <button className="btn" onClick={() => navigate('/login')}>
              Entrar
            </button>
            <button className="btn ghost" onClick={() => navigate('/signup')}>
              Criar conta
            </button>
            {planoExpirado && (
              <>
                <div className="home-warning" role="alert" aria-live="assertive" aria-atomic="true">
                  ⚠️ Seu plano expirou. Toque em ‘Renovar plano’ para continuar.
                </div>
                <button className="btn pulse" onClick={() => navigate('/renew-plan')}>
                  Renovar plano
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
