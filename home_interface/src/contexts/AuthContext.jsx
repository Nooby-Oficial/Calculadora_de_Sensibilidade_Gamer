import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planoValido, setPlanoValido] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authApi.checkToken(token);
          if (res.valido) {
            // res.user: { nome, email, validadePlano, ... }
            setUser({ token, ...res.user });
            setPlanoValido(res.planoValido);
          } else {
            setUser(null);
            setPlanoValido(false);
            localStorage.removeItem('token');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Erro ao verificar token:', error);
          setUser(null);
          setPlanoValido(false);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, senha) => {
    const res = await authApi.login(email, senha);
    localStorage.setItem('token', res.token);
    setUser({ token: res.token, ...res.user });
    setPlanoValido(res.planoValido);
  };

  const signup = async (nome, email, senha) => {
    const res = await authApi.signup(nome, email, senha);
    localStorage.setItem('token', res.token);
    setUser({ token: res.token, ...res.user });
    setPlanoValido(res.planoValido);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPlanoValido(false);
  };

  const renewPlan = async () => {
    if (!user?.token) return;
    const res = await authApi.renewPlan(user.token);
    setPlanoValido(res.planoValido);
  };

  return (
    <AuthContext.Provider value={{ user, planoValido, loading, login, signup, logout, renewPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
