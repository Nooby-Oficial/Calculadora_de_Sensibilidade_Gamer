import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Entrar - Calculadora de Sensibilidade';
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (!form.email || !form.senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    try {
      await login(form.email, form.senha);
      showToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErro('E-mail ou senha inválidos.');
      showToast('E-mail ou senha inválidos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <main className="home-main card">
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#00ffe7" strokeWidth="2" />
              <path d="M12 7a3 3 0 100 6 3 3 0 000-6z" fill="#00ffe7" />
              <path
                d="M6 18c0-2.21 3.58-3.5 6-3.5s6 1.29 6 3.5"
                stroke="#00ffe7"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Entrar
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              required
            />
            <input
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              className="btn"
              type="submit"
              disabled={isLoading || loading}
              aria-busy={isLoading || loading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" /> Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          {erro && (
            <div className="home-warning" role="alert" aria-live="assertive" aria-atomic="true">
              {erro}
            </div>
          )}
          <button className="btn ghost" onClick={() => navigate('/signup')}>
            Criar conta
          </button>
        </main>
      </div>
    </div>
  );
};

export default Login;
