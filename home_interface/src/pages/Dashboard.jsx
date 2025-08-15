import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, planoValido, logout, loading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Dashboard - Calculadora de Sensibilidade';
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <div className="container">
          <main className="home-main card">
            <h2>Dashboard</h2>
            <p>
              <span className="spinner" /> Carregando dados...
            </p>
          </main>
        </div>
      </div>
    );
  }

  const email = user?.email || 'usuario@email.com';
  const nome = user?.nome || 'Usuário';
  const validade = user?.validadePlano || '---';
  const statusPlano = planoValido ? 'Ativo' : 'Expirado';
  const corStatus = planoValido ? '#00ffe7' : '#ffb300';

  return (
    <div className="home-container">
      <div className="container">
        <main className="home-main card">
          <h2 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#00ffe7" strokeWidth="2" />
              <path d="M12 7a3 3 0 100 6 3 3 0 000-6z" fill="#00ffe7" />
              <path
                d="M6 18c0-2.21 3.58-3.5 6-3.5s6 1.29 6 3.5"
                stroke="#00ffe7"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Painel do Usuário
          </h2>
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>👤 {nome}</div>
            <div style={{ color: '#7ee7e7', marginBottom: 8 }}>✉️ {email}</div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>
              Plano: <span style={{ color: corStatus, fontWeight: 700 }}>{statusPlano}</span>
            </div>
            <div style={{ color: '#b3b3b3', fontSize: '0.98rem' }}>
              Validade: <span style={{ color: '#00ffe7' }}>{validade}</span>
            </div>
          </div>
          <button
            className="btn"
            onClick={() => {
              logout();
              showToast('Logout realizado com sucesso!', 'success');
              navigate('/');
            }}
          >
            Sair
          </button>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
