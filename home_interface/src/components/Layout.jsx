import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SiteHeader = () => {
  const navigate = useNavigate();
  const { user, planoValido, logout } = useAuth();
  const isAuthed = Boolean(user);
  const canAccess = isAuthed && planoValido;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          className="brand"
          onClick={() => navigate('/')}
          aria-label="Ir para a página inicial"
        >
          <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
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
          </svg>
          <span className="brand-text">Sensibilidade</span>
        </button>
        <nav className="site-nav">
          {!isAuthed && (
            <>
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                to="/login"
              >
                Entrar
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                to="/signup"
              >
                Criar conta
              </NavLink>
            </>
          )}
          {isAuthed && (
            <>
              {canAccess && (
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              )}
              {!planoValido && (
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                  to="/renew-plan"
                >
                  Renovar plano
                </NavLink>
              )}
              <button
                className="btn nav-btn"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
};

export default Layout;
