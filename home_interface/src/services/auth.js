// Serviço de autenticação para integração com backend
// Substitua as URLs pelos endpoints reais da sua API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Ajuste conforme necessário
const USE_MOCK = !import.meta.env.VITE_API_URL; // Use mock se não houver API_URL definida

// Simulação para desenvolvimento/testes
const mockAuth = {
  async login(email, senha) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay
    if (email === 'admin@test.com' && senha === '123456') {
      return {
        token: 'mock-token-' + Date.now(),
        planoValido: true,
        user: { nome: 'Usuário Teste', email, validadePlano: '2024-12-31' },
      };
    }
    throw new Error('E-mail ou senha inválidos');
  },

  async signup(nome, email) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      token: 'mock-token-' + Date.now(),
      planoValido: true,
      user: { nome, email, validadePlano: '2024-12-31' },
    };
  },

  async checkToken(token) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (token && token.startsWith('mock-token')) {
      return {
        valido: true,
        planoValido: true,
        user: { nome: 'Usuário Teste', email: 'admin@test.com', validadePlano: '2024-12-31' },
      };
    }
    return { valido: false };
  },

  async renewPlan() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { planoValido: true };
  },
};

export async function login(email, senha) {
  if (USE_MOCK) {
    return mockAuth.login(email, senha);
  }

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) throw new Error('Login inválido');
  return res.json();
}

export async function signup(nome, email, senha) {
  if (USE_MOCK) {
    return mockAuth.signup(nome, email, senha);
  }

  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha }),
  });
  if (!res.ok) throw new Error('Erro no cadastro');
  return res.json();
}

export async function renewPlan(token) {
  if (USE_MOCK) {
    return mockAuth.renewPlan(token);
  }

  const res = await fetch(`${API_URL}/renew-plan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao renovar plano');
  return res.json();
}

export async function checkToken(token) {
  if (USE_MOCK) {
    return mockAuth.checkToken(token);
  }

  const res = await fetch(`${API_URL}/check-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { valido: false };
  return res.json();
}
