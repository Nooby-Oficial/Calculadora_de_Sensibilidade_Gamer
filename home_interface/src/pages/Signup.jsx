import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Criar conta - Calculadora de Sensibilidade';
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (!form.nome || !form.email || !form.senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    try {
      await signup(form.nome, form.email, form.senha);
      showToast('Conta criada com sucesso!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setErro('Erro ao criar conta. Tente novamente.');
      showToast('Erro ao criar conta. Tente novamente.', 'error');
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
            Criar conta
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="nome"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            <input
              name="senha"
              type="password"
              placeholder="Crie uma senha"
              value={form.senha}
              onChange={handleChange}
              autoComplete="new-password"
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
                  <span className="spinner" /> Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>
          {erro && (
            <div className="home-warning" role="alert" aria-live="assertive" aria-atomic="true">
              {erro}
            </div>
          )}
          <button className="btn ghost" onClick={() => navigate('/login')}>
            Já tenho conta
          </button>
        </main>
      </div>
    </div>
  );
};

export default Signup;
