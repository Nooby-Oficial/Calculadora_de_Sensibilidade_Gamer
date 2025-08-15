import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Página não encontrada - Calculadora de Sensibilidade';
  }, []);

  return (
    <div className="home-container">
      <div className="container">
        <main className="home-main card" style={{ textAlign: 'center' }}>
          <h2 style={{ marginTop: 0 }}>404 - Página não encontrada</h2>
          <p className="subtitle" style={{ marginBottom: 16 }}>
            O caminho acessado não existe. Se quiser, volte para a página inicial.
          </p>
          <button className="btn" onClick={() => navigate('/')}>
            Voltar ao início
          </button>
        </main>
      </div>
    </div>
  );
};

export default NotFound;
