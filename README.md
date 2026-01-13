# Teste Técnico Vituax

## 📋 Sumário

- [Sobre o Teste](#sobre-o-teste)
- [IMPORTANTE: Como Entregar o Teste](#️-importante-como-entregar-o-teste)
- [Objetivos](#objetivos)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Requisitos do Sistema](#requisitos-do-sistema)
- [Stack Tecnológica](#stack-tecnológica)
- [Configuração e Instalação](#configuração-e-instalação)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Estrutura de Portas](#estrutura-de-portas)
- [Conceitos Importantes](#conceitos-importantes)
- [Permissões de Usuários](#permissões-de-usuários)
- [Credenciais de Teste](#credenciais-de-teste)
- [Fluxo de Desenvolvimento (GitFlow)](#fluxo-de-desenvolvimento-gitflow)
- [Tarefas do Desafio](#tarefas-do-desafio)
  - [Configuração Inicial](#configuração-inicial)
  - [Autenticação e Autorização](#autenticação-e-autorização)
  - [Funcionalidades da Home Page](#funcionalidades-da-home-page)
  - [Criação de VM](#criação-de-vm)
  - [Gerenciamento de VMs (My VMs)](#gerenciamento-de-vms-my-vms)
  - [Cadastro de MSP](#cadastro-de-msp)
  - [Cadastro de Funcionários](#cadastro-de-funcionários)
  - [Configuração White Label](#configuração-white-label)
  - [Configuração de Perfil e Notificações](#configuração-de-perfil-e-notificações)
  - [Tarefas Opcionais/Diferenciais](#tarefas-opcionaisdiferenciais)
- [Referências Visuais](#referências-visuais)
- [Lembrete Final](#-lembrete-final)

---

## 🎯 Sobre o Teste

O objetivo deste teste técnico é avaliar sua habilidade em:

- **Seguir padrões já estabelecidos** no projeto
- **Pesquisar, compreender e aplicar** elementos existentes na arquitetura
- **Trabalhar com o código**, utilizando as bibliotecas e estruturas já implementadas

Você pode criar, instalar e utilizar outras bibliotecas, porém o **foco principal** deve ser trabalhar com o que já existe no projeto.

### 📚 Recomendações Importantes

1. **Entenda a arquitetura**: Gaste um tempo seguindo o fluxo do código, entendendo a localização dos componentes e como eles estão conectados.
2. **Explore o projeto**: Analise as funções, estilos e padrões já existentes antes de começar a implementar.
3. **Sinta-se livre para melhorar**: Você pode fazer melhorias e simplificações, desde que não fuja da proposta inicial.

---

## ⚠️ IMPORTANTE: Como Entregar o Teste

### 🔄 Fork do Repositório

**ATENÇÃO**: Você deve fazer um **fork** deste repositório para sua própria conta do GitHub.

#### Passos para começar:

1. **Faça o fork** deste repositório para sua conta pessoal do GitHub
2. **Clone o seu fork** (não o repositório original):
   ```bash
   git clone https://github.com/SEU-USUARIO/TestTecVix.git
   cd TestTecVix
   ```
3. Trabalhe no **seu repositório** seguindo o fluxo de desenvolvimento descrito neste README
4. Faça commits e pushes para o **seu repositório**

### ⚠️ ATENÇÃO: Pull Requests

> **🚨 IMPORTANTE**: Os Pull Requests devem ser feitos **APENAS NO SEU REPOSITÓRIO**, não no repositório da Vituax!

- ✅ **CORRETO**: Criar PRs de `feature/*` → `release` e `release` → `main` **no seu fork**
- ❌ **INCORRETO**: Criar PRs para o repositório original da Vituax

**Pull Requests externos para o repositório da Vituax serão automaticamente fechados pelo GitHub Actions.**

### 🔓 Repositório Público

> **📢 IMPORTANTE**: Seu repositório fork **DEVE SER PÚBLICO** para que a equipe da Vituax possa avaliar seu trabalho.

Certifique-se de que:

- [x] Seu repositório está configurado como **público** (não privado)
- [x] A equipe da Vituax consegue acessar o link sem necessidade de permissões especiais

### 📤 Entrega do Teste

Ao finalizar o teste, você deve:

1. ✅ Garantir que todo o código está commitado e enviado para o **seu repositório no GitHub**
2. ✅ Verificar se o README está atualizado com:
   - Suas principais modificações
   - As soluções que você desenvolveu
   - Credenciais de teste (se aplicável)
3. ✅ **Enviar o link do seu repositório no GitHub** para a equipe da Vituax

### 📋 Checklist de Entrega

Antes de enviar, certifique-se de que:

- [x] O código está no **seu repositório pessoal** do GitHub
- [x] O repositório está configurado como **público** (não privado)
- [x] A branch `main` contém o projeto original
- [x] A branch `release` contém todas as suas modificações
- [x] Existe um Pull Request da `release` para a `main` **no seu repositório**
- [x] O README está atualizado com suas modificações
- [x] O projeto está funcionando corretamente
- [x] As credenciais de teste estão documentadas

> **🎯 LEMBRE-SE**: O link que você enviará deve ser do formato:
> `https://github.com/SEU-USUARIO/TestTecVix`

---

## 🎯 Objetivos

Este teste avalia sua capacidade de:

- Compreender e seguir uma arquitetura existente
- Implementar funcionalidades seguindo padrões estabelecidos
- Trabalhar com autenticação e autorização (JWT)
- Desenvolver interfaces responsivas e funcionais
- Utilizar boas práticas de versionamento (GitFlow)
- Documentar adequadamente o projeto

---

## 🏗️ Arquitetura do Projeto

O projeto está dividido em três partes principais:

```
TestTecVix/
├── backend-node-vix-test/    # API REST em Node.js + Express + Prisma
├── frontend-react-vix-test/  # Interface em React + TypeScript + Material-UI
├── screenshots/              # Imagens de referência para as telas
└── README.md                 # Este arquivo
```

---

## 💻 Requisitos do Sistema

Antes de começar, certifique-se de ter instalado:

- **Sistema Operacional**: Linux (preferencialmente), macOS ou Windows
- **Docker**: Versão mais recente instalada e configurada
- **Node.js**: Versão LTS (Long Term Support)
- **npm** ou **yarn**: Gerenciador de pacotes

---

## 🛠️ Stack Tecnológica

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM (Object-Relational Mapping)
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **TypeScript** - Superset JavaScript tipado
- **Jest** - Framework de testes

### Frontend

- **React** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Zustand** - Gerenciamento de estado
- **i18next** - Internacionalização
- **Vitest** - Framework de testes

---

## ⚙️ Configuração e Instalação

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd TestTecVix
```

### 2. Configuração do Backend

#### 2.1. Navegue até a pasta do backend

```bash
cd backend-node-vix-test
```

#### 2.2. Instale as dependências

```bash
npm install
```

#### 2.3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as seguintes configurações:

```env
# URL de conexão com o banco de dados
DATABASE_URL=mysql://root:password@localhost:3312/test-cloud-db

# Configurações do MySQL
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=test-cloud-db
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_HOST=localhost

# Secret para geração de tokens JWT
JWT_SECRET=seu_secret_super_seguro_aqui
```

> **Nota**: A porta do banco de dados é **3312** (não confundir com a porta padrão 3306 do MySQL).

#### 2.4. Suba o banco de dados

```bash
npm run db:up
```

Este comando irá:

- Subir um container Docker com MySQL
- Utilizar o arquivo `docker-compose-db.yml`
- Expor o banco na porta **3312**

#### 2.5. Configure o Prisma e popule o banco

```bash
# Gera o Prisma Client
npx prisma generate

# Executa as migrations e popula o banco com dados de teste
npx prisma migrate reset
```

Ou, alternativamente:

```bash
npx prisma migrate deploy && npx prisma db seed
```

> **Importante**: O comando `migrate reset` irá **apagar todos os dados** e recriar o banco. Use com cuidado!

### 3. Configuração do Frontend

#### 3.1. Navegue até a pasta do frontend

```bash
cd ../frontend-react-vix-test
```

#### 3.2. Instale as dependências

```bash
npm install
```

#### 3.3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.exemple`:

```bash
cp .env.exemple .env
```

Edite o arquivo `.env`:

```env
# URL base da API
VITE_BASE_URL=http://localhost:3001/api/v1
```

---

## 🚀 Como Executar o Projeto

### Modo Desenvolvimento

#### Backend (API)

```bash
cd backend-node-vix-test
npm run dev
```

A API estará disponível em: **http://localhost:3001**

#### Frontend

```bash
cd frontend-react-vix-test
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

---

### Modo Produção (Docker)

#### Backend

```bash
cd backend-node-vix-test

# Build da aplicação
npm run build

# Sobe o container Docker
npm run dc:up
```

#### Frontend

```bash
cd frontend-react-vix-test

# Sobe o container Docker (já faz o build automaticamente)
npm run dc:up
```

---

## 🔌 Estrutura de Portas

| Serviço  | Porta |
| -------- | ----- |
| Frontend | 3000  |
| Backend  | 3001  |
| MySQL    | 3312  |

---

## 📖 Conceitos Importantes

### MSP vs BrandMaster

- **Internamente** e a nível de arquitetura, temos a entidade `brandMaster` (que representa empresas dentro do sistema)
- **Comercialmente** e em muitos lugares no projeto, aparece o termo `MSP`
- Para todos os efeitos, **MSP = BrandMaster** (são a mesma entidade)

### Tipos de Usuários

#### Usuário Vituax

- Usuário **sem** `idBrandMaster` associado
- Considerado um usuário da própria Vituax

#### Usuário com BrandMaster

- Usuário **com** `idBrandMaster` associado
- Pertence a uma empresa/MSP específica

---

## 🔐 Permissões de Usuários

O sistema possui três níveis de permissão:

| Tipo      | Leitura | Criação | Edição | Exclusão |
| --------- | ------- | ------- | ------ | -------- |
| `member`  | ✅      | ❌      | ❌     | ❌       |
| `manager` | ✅      | ✅      | ✅     | ❌       |
| `admin`   | ✅      | ✅      | ✅     | ✅       |

### Detalhamento

- **Member (Membro)**: Somente leitura. Não pode criar, editar ou deletar nenhum recurso.
- **Manager (Gerente)**: Pode ler, criar e editar recursos, mas **não pode deletar**.
- **Admin (Administrador)**: Acesso total. Pode ler, criar, editar e deletar recursos.

---

## 🔑 Credenciais de Teste

```
Admin Vituax:
  Email: admin@vituax.com
  Senha: Admin@123

Manager Vituax:
  Email: manager@vituax.com
  Senha: Manager@123

Member Vituax:
  Email: member@vituax.com
  Senha: Member@123

---

Admin Upix MSP:
  Email: admin@upix.com
  Senha: Admin@123

Manager Upix MSP:
  Email: manager@upix.com
  Senha: Manager@123

Member Upix MSP:
  Email: member@upix.com
  Senha: Member@123

---

Admin Vituax MSP:
  Email: admin@vituaxmsp.com
  Senha: Admin@123

```

---

## 🌿 Fluxo de Desenvolvimento (GitFlow)

Para demonstrar suas habilidades com versionamento, siga este fluxo sugerido:

### 1. Estrutura de Branches

```
main (projeto original)
  └── release (suas modificações)
       ├── feature/auth-login
       ├── feature/crud-users
       ├── feature/vm-management
       ├── feature/msp-registration
       └── ...
```

### 2. Workflow Recomendado

1. **Mantenha a `main`** com o projeto original (sem modificações)
2. **Crie uma branch `release`** a partir da `main`
3. **Para cada funcionalidade/tela**, crie uma branch específica:
   ```bash
   git checkout release
   git checkout -b feature/nome-da-funcionalidade
   ```
4. **Ao finalizar cada funcionalidade**:
   - Faça commits descritivos
   - Abra um Pull Request da `feature/*` para `release`
   - Faça o merge após a sua revisão
5. **No final do teste**:
   - Teremos a branch `main` (projeto original)
   - E um Pull Request da `release` apontando para `main` (com todas as suas modificações)

### 3. Exemplo de Commits

```bash
git commit -m "feat: implementa autenticação JWT no backend"
git commit -m "feat: adiciona tela de login no frontend"
git commit -m "fix: corrige validação de senha no formulário"
git commit -m "refactor: melhora estrutura de pastas dos componentes"
git commit -m "docs: atualiza README com credenciais de teste"
```

---

## ✅ Tarefas do Desafio

### 📋 Configuração Inicial

- [x] Criar arquivo `.env` baseado no `.env.example` (backend)
- [x] Criar arquivo `.env` baseado no `.env.exemple` (frontend)

---

### 🔐 Autenticação e Autorização

- [x] Implementar as rotas de CRUD para usuários
- [x] Implementar rota de login do usuário
- [x] Implementar tela de login `/login`
- [x] Implementar rota de register do usuário
- [x] Implementar tela de register `/register`
- [x] Implementar autenticação com token JWT
- [x] Proteger as rotas da aplicação (exceto login e register) para que somente usuários logados possam acessar
- [x] Adicionar credenciais de usuários de teste no README e/ou `.env.example`

---

### 🗄️ Updates no Banco de Dados

- [x] Adicionar coluna `pass` na tabela `VM` (senha da VM, respeitando regras de segurança)
- [x] Adicionar coluna `location` do tipo `ETaskLocation` na tabela `VM`
- [x] Adicionar coluna `hasBackup` na tabela `VM`

---

### 🏠 Funcionalidades da Home Page

**VM Card List:**

- [x] Implementar a função de **start** da VM
- [x] Implementar a função de **pause** da VM
- [x] Implementar os gráficos (mocados) de **Uso de CPU**
- [x] Implementar os gráficos (mocados) de **Uso de Memória**

---

### ➕ Criação de VM

- [x] Implementar a lista dropdown dos **sistemas operacionais**
- [x] Implementar corretamente a **criação de uma VM**
- [x] Possibilitar a aceitação de **configurações dos cards de sugestão**

---

### 💾 Gerenciamento de VMs (My VMs)

**Filtros:**

- [x] Implementar filtro de **pesquisa** (busca por nome)
- [x] Implementar filtro por **status da VM**
- [x] Implementar filtro por **MSP/BrandMaster**
- [x] Implementar filtro **"Apenas minhas VMs"** (VMs exclusivas da mesma BrandMaster do usuário logado)

**Ações:**

- [x] Possibilitar **stop/start** da VM pela tabela
- [x] Possibilitar **stop/start** da VM pelo modal de edição

**Modal de Edição:**

- [x] Trazer corretamente as **informações da VM** no modal
- [x] Possibilitar editar: **senha da VM**
- [x] Possibilitar editar: **nome da VM**
- [x] Possibilitar editar: **vCPU**
- [x] Possibilitar editar: **Memória**
- [x] Possibilitar editar: **Disco**
- [x] Possibilitar editar: **habilitar/desabilitar backup**

**Exclusão:**

- [x] Possibilitar **deletar VM** (somente usuários tipo `admin` podem deletar)

---

### 🏢 Cadastro de MSP

**Referências visuais**: `screenshots/CadastroDeMSPStep01.png` e `screenshots/CadastroDeMSPStep02.png`

- [x] Implementar componente para **cadastro de MSP em 2 etapas**
- [x] Possibilitar **criar um novo MSP**
- [x] Possibilitar **editar um MSP já existente**
- [x] Adicionar campos de **endereço** (ou puxar pelo CEP e/ou CNPJ)
- [x] Implementar filtros de **search**
- [x] Implementar flag de **"Mostrar somente os que estão em POC"**

---

### 👥 Cadastro de Funcionários

**Referência visual**: `screenshots/CadastroDeFuncionarios.png`

- [x] Implementar a tela de **cadastro de funcionários** seguindo a imagem de referência
- [x] Atentar para a **responsividade**
- [x] Considerar as **traduções** (i18n)

---

### 🎨 Configuração White Label

- [x] Permitir que a **logo da empresa** do usuário seja alterada
- [x] Somente usuários **admin** podem realizar essa alteração

---

### 👤 Configuração de Perfil e Notificações

- [x] Permitir a edição das **informações de contato**
- [x] Permitir a edição da **senha**
- [x] Permitir a edição da **imagem de perfil** do usuário logado

---

### 🌟 Tarefas Opcionais/Diferenciais

#### Testes

- [x] Implementar **testes de snapshot**
- [x] Implementar **testes unitários**
- [x] Implementar **testes de integração**
- [x] Implementar **testes E2E (end-to-end)**

#### Documentação Swagger

- [x] Fazer a **documentação Swagger da API**
- [x] Verificar a rota `/docs` na API para visualizar a documentação

---

## 📸 Referências Visuais

As imagens de referência para as telas estão localizadas na pasta `screenshots/`:

- `CadastroDeMSPStep01.png` - Cadastro de MSP (Etapa 1)
- `CadastroDeMSPStep02.png` - Cadastro de MSP (Etapa 2)
- `CadastroDeFuncionarios.png` - Cadastro de Funcionários

Utilize essas imagens como guia para implementar as interfaces.

---

## 📝 Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run dev                 # Inicia servidor em modo desenvolvimento
npm run build              # Compila o projeto TypeScript
npm run start              # Inicia servidor em modo produção
npm run test               # Executa testes com cobertura
npm run test:dev           # Executa testes em modo watch

# Docker
npm run db:up              # Sobe o banco de dados MySQL
npm run db:down            # Para o banco de dados
npm run dc:up              # Sobe a API em container Docker
npm run dc:down            # Para a API

# Prisma
npx prisma generate        # Gera o Prisma Client
npx prisma migrate dev     # Cria e aplica migrations
npx prisma migrate reset   # Reseta o banco e aplica seeds
npx prisma studio          # Abre interface visual do banco

# Qualidade de código
npm run lint               # Verifica problemas no código
npm run lint:fix           # Corrige problemas automaticamente
npm run format             # Formata código com Prettier
```

### Frontend

```bash
# Desenvolvimento
npm run dev                # Inicia servidor de desenvolvimento
npm run build              # Compila para produção
npm run preview            # Preview da build de produção

# Docker
npm run dc:up              # Sobe o frontend em container Docker
npm run dc:down            # Para o frontend

# Testes
npm run test               # Executa testes em modo watch
npm run test:coverage      # Executa testes com cobertura

# Qualidade de código
npm run lint               # Verifica problemas no código
npm run format             # Formata código com Prettier
```

---

## 🤝 Boas Práticas

1. **Commits semânticos**: Use prefixos como `feat:`, `fix:`, `refactor:`, `docs:`, etc.
2. **Code review**: Revise seu próprio código antes de fazer o commit
3. **Testes**: Sempre que possível, adicione testes para suas funcionalidades
4. **Documentação**: Mantenha o README atualizado com suas modificações
5. **Clean code**: Siga os padrões de código já estabelecidos no projeto

---

## 📚 Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do React](https://react.dev/)
- [Documentação do Material-UI](https://mui.com/)
- [JWT.io](https://jwt.io/) - Para entender tokens JWT

---

## 📧 Dúvidas

Se tiver dúvidas sobre o teste, entre em contato com o time da Vituax.

---

## 🎯 Lembrete Final

### Não se esqueça de:

1. ✅ **Fazer o fork** deste repositório para sua conta do GitHub
2. ✅ **Trabalhar no seu repositório** (não no repositório original)
3. ✅ **Atualizar este README** com suas modificações e soluções
4. ✅ **Enviar o link do SEU repositório** no GitHub para a equipe da Vituax

---

**Boa sorte! 🚀**

**Esperamos receber o link do seu repositório em breve!** 📬
