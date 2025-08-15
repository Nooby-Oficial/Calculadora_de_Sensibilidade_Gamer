# 🎮 Calculadora de Sensibilidade para Jogos

Uma aplicação web moderna e responsiva para calcular e ajustar sensibilidades em jogos móveis, desenvolvida com React e Vite.

## ✨ Funcionalidades

- 🏠 **Página Inicial** - Interface atrativa com tema gamer
- 🔐 **Sistema de Autenticação** - Login e cadastro de usuários
- 📊 **Dashboard** - Painel personalizado para usuários logados
- 🛡️ **Rotas Protegidas** - Segurança e controle de acesso
- 🎨 **Design Moderno** - Interface dark com gradientes neon
- 📱 **Responsivo** - Funciona perfeitamente em todos os dispositivos
- 🔔 **Notificações** - Sistema de toast para feedback ao usuário

## 🛠️ Tecnologias Utilizadas

- **React 18.2.0** - Biblioteca principal para UI
- **Vite 4.4.5** - Build tool e servidor de desenvolvimento
- **React Router 6.8.1** - Roteamento client-side
- **Context API** - Gerenciamento de estado global
- **CSS3** - Estilização com variáveis e animações
- **JavaScript ES6+** - Linguagem de programação

## 📁 Estrutura do Projeto

```
home_interface/
├── public/
│   └── index.html          # Página HTML principal
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── PrivateRoute.jsx
│   ├── contexts/          # Contextos React
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── RenewPlan.jsx
│   │   └── Signup.jsx
│   ├── services/          # Serviços e APIs
│   │   └── auth.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Entry point
│   └── style.css         # Estilos globais
├── package.json          # Dependências e scripts
├── vite.config.js        # Configuração Vite
└── README.md            # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
1. Clone o repositório
```bash
git clone https://github.com/Nooby-Oficial/Calculadora-de-Sensibilidade-para-Jogos-Mobile.git
```

2. Navegue até a pasta home_interface
```bash
cd home_interface
```

3. Instale as dependências
```bash
npm install
```

4. Execute o servidor de desenvolvimento
```bash
npm run dev
```

5. Abra o navegador em `http://localhost:3000`

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa linting do código

## 🎯 Funcionalidades Principais

### Autenticação
- Sistema completo de login/cadastro
- Persistência de sessão via localStorage
- Proteção de rotas sensíveis

### Interface
- Design responsivo e moderno
- Tema dark com elementos neon
- Animações suaves e transições
- Feedback visual com toasts

### Navegação
- Roteamento client-side
- Lazy loading de componentes
- Proteção de rotas privadas

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` para configurações:
```
VITE_API_URL=sua_api_url_aqui
```

### Backend
O projeto inclui um mock backend para desenvolvimento. Para produção, atualize `src/services/auth.js` com sua API real.

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Preview Local
```bash
npm run preview
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👤 Autor

**Nooby-Oficial**
- GitHub: [@Nooby-Oficial](https://github.com/Nooby-Oficial)

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se livre para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
