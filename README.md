# 🌿 SharkLeaf — Sistema de Gestão e Gamificação para Viveiros

<p align="center">
  <strong>Controle de pedidos, estoque e canteiros com fidelização de clientes via QR Code e gamificação.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 📋 Sobre o Projeto

**SharkLeaf** é uma solução tecnológica desenvolvida como **Trabalho de Conclusão de Curso (TCC)** do IFSC — Campus Tubarão, voltada para o setor do **agronegócio**, especificamente para **produtores de mudas** (eucalipto, pinus, acácia e espécies nativas).

O sistema resolve o problema de controles manuais via planilhas e papéis, unindo **gestão interna de processos** (pedidos, estoque, canteiros) com uma **experiência externa de fidelização** para o cliente final, baseada em **gamificação e rastreabilidade por QR Code**.

### Autores

- **Diego Formentin**
- **Fernando Sousa**

---

## ✨ Funcionalidades Principais

### 🏪 Área Administrativa (Produtor)

| Funcionalidade | Descrição |
|---|---|
| **Dashboard** | Métricas de engajamento, taxa de escaneamento, pedidos em andamento |
| **Gestão de Pedidos** | Criação com múltiplos produtos e canteiros, fluxo de status, QR Code e ticket |
| **Gestão de Produtos** | CRUD com categorias, descrição e preço unitário |
| **Gestão de Canteiros** | CRUD de áreas de cultivo com capacidade |
| **Controle de Estoque** | Estoque setorial por canteiro, ajustes manuais, histórico de movimentações |
| **Gestão de Clientes** | Visualização de clientes, pontos e pedidos |
| **Painel TV (Monitor)** | Exibição de pedidos em produção/prontos com atualização automática a cada 60s |
| **Configurações** | Perfil do produtor (dados públicos para contato) |

### 📱 Área do Cliente

| Funcionalidade | Descrição |
|---|---|
| **Rastreio por QR Code** | Escaneie para ver status, produtos e trilha do pedido (sem necessidade de login) |
| **Portal Gamificado** | Visualização de pontos, título de progressão, medalhas e brindes |
| **Resgate de Pontos** | Escaneie o QR Code e resgate pontos ao estar logado (1 ponto por unidade) |
| **Códigos de Brinde** | A cada 100 pontos, um código é gerado automaticamente para desconto em pedidos futuros |
| **Trilha do Produto** | Informações enriquecidas por IA (nome científico, características, cuidados) |

### 🎮 Sistema de Gamificação

- **Pontos**: 1 ponto por unidade de produto no pedido
- **Títulos de Progressão**:
  - 🌱 **Plantador Novato**: 0 – 100 pontos
  - 🌿 **Cultivador Engajado**: 101 – 500 pontos
  - 🌳 **Mestre Florestal**: 501+ pontos
- **Brindes**: A cada 100 pontos acumulados, um código de brinde único é gerado
- **Medalhas**: Conquistas por ações específicas (Primeiro Pedido, Feedback Master, Cliente Fiel, etc.)

### 📦 Fluxo de Pedidos

```
RECEBIDO → PRODUÇÃO → EMPACOTAMENTO → PRONTO → (Resgate de pontos pelo cliente)
                                         ↘ CANCELADO (restaura estoque)
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, TypeScript 5 |
| **Estilização** | Tailwind CSS 4, shadcn/ui, Lucide React |
| **Banco de Dados** | SQLite (via Prisma ORM 5) |
| **Autenticação** | NextAuth.js v4 (Credentials Provider + JWT) |
| **QR Code** | qrcode.react |
| **Integração IA** | OpenAI GPT (trilha do produto) |
| **Validação** | Zod, React Hook Form |
| **Notificações** | Sonner (toasts) |
| **Atualização em tempo real** | SWR (polling) |

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ instalado
- [Git](https://git-scm.com/) instalado
- (Opcional) Chave da API da [OpenAI](https://platform.openai.com/) para a trilha do produto com IA

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sharkleaf.git
cd sharkleaf
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-com-openssl-rand-base64-32"
OPENAI_API_KEY="sua-chave-openai-aqui"
```

> 💡 Para gerar o `NEXTAUTH_SECRET`, execute:
> ```bash
> openssl rand -base64 32
> ```

### 4. Configurar o banco de dados

```bash
# Gerar o client do Prisma
npx prisma generate

# Criar o banco e aplicar as migrations
npx prisma db push

# Popular com dados iniciais (admin, produtos, canteiros, estoque)
npm run db:seed
```

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em:
- **Local**: http://localhost:3000
- **Rede**: http://seu-ip:3000 (acessível pelo celular na mesma rede Wi-Fi)

### 6. Acessar o sistema

| Perfil | URL | Credenciais |
|---|---|---|
| **Admin** | http://localhost:3000/login | `admin@sharkleaf.com` / `admin123` |
| **Cliente** | http://localhost:3000/registro | Criar conta pelo formulário |
| **Monitor/TV** | http://localhost:3000/monitor | Sem login necessário |

---

## 📂 Estrutura do Projeto

```
sharkleaf/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── seed.ts                # Dados iniciais (admin, produtos, canteiros)
│   └── dev.db                 # Banco SQLite (gerado automaticamente)
├── src/
│   ├── app/
│   │   ├── (admin)/           # 🏪 Área administrativa
│   │   │   ├── dashboard/     #    Dashboard com métricas
│   │   │   ├── pedidos/       #    Gestão de pedidos (lista, detalhe, novo)
│   │   │   ├── produtos/      #    CRUD de produtos
│   │   │   ├── canteiros/     #    CRUD de canteiros
│   │   │   ├── estoque/       #    Controle de estoque
│   │   │   ├── clientes/      #    Visualização de clientes
│   │   │   └── config/        #    Configurações do produtor
│   │   ├── (cliente)/         # 📱 Área do cliente
│   │   │   ├── rastreio/[id]/ #    Rastreio por ID do pedido
│   │   │   ├── rastreio/ticket/[ticket]/ # Rastreio por ticket
│   │   │   └── portal/        #    Portal gamificado
│   │   ├── (display)/         # 📺 Painel público
│   │   │   └── monitor/       #    Painel TV (atualiza a cada 60s)
│   │   ├── api/               # 🔌 API Routes
│   │   │   ├── auth/          #    Autenticação (NextAuth)
│   │   │   ├── pedidos/       #    CRUD de pedidos
│   │   │   ├── produtos/      #    CRUD de produtos
│   │   │   ├── canteiros/     #    CRUD de canteiros
│   │   │   ├── estoque/       #    Ajustes de estoque
│   │   │   ├── escaneamento/  #    Registro de escaneamentos QR
│   │   │   ├── resgatar-pontos/ # Resgate de pontos
│   │   │   ├── brindes/       #    Geração e validação de brindes
│   │   │   ├── trilha/        #    Consulta IA (trilha do produto)
│   │   │   ├── monitor/       #    Dados para painel TV
│   │   │   └── registro/      #    Cadastro de clientes
│   │   ├── login/             # Página de login
│   │   ├── registro/          # Página de cadastro
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── admin/             # Componentes da área admin
│   │   ├── cliente/           # Componentes da área do cliente
│   │   ├── ui/                # Componentes shadcn/ui
│   │   ├── providers.tsx      # Providers (NextAuth, Sonner)
│   │   └── qr-code-display.tsx # Componente de QR Code
│   ├── lib/
│   │   ├── auth.ts            # Configuração NextAuth
│   │   ├── helpers.ts         # Funções utilitárias
│   │   ├── prisma.ts          # Cliente Prisma singleton
│   │   └── utils.ts           # Utilitários (cn)
│   ├── types/
│   │   └── next-auth.d.ts     # Tipos customizados NextAuth
│   └── middleware.ts          # Middleware de autenticação
├── .env                       # Variáveis de ambiente
├── next.config.ts             # Configuração Next.js
├── package.json
└── tsconfig.json
```

---

## 🗃️ Modelo de Dados

```
┌─────────────┐    ┌─────────────┐    ┌──────────────────┐
│   Canteiro   │    │   Produto   │    │ EstoqueCanteiro  │
│─────────────│    │─────────────│    │──────────────────│
│ nome         │◄──┤ nome        │◄──┤ quantidade        │
│ capacidade   │    │ categoria   │    │ produtoId ────────┤
│              │    │ precoUnit.  │    │ canteiroId ───────┤
└──────┬───────┘    └──────┬──────┘    └──────────────────┘
       │                   │
       ▼                   ▼
┌──────────────────────────────────┐
│             Pedido               │
│──────────────────────────────────│
│ ticket (único) │ qrCode (único)  │
│ status         │ valorTotal      │
│ pontosGerados  │ resgatado       │
│ desconto       │ codigoBrinde    │
│ clienteId? ──────► Cliente       │
├──────────────────────────────────┤
│         ItemPedido[]             │
│    (produto + canteiros usados)  │
└──────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Cliente   │    │   Brinde    │    │   Medalha   │
│─────────────│    │─────────────│    │─────────────│
│ nome        │◄──┤ codigo      │    │ nome        │
│ email       │    │ usado       │    │ condicao    │
│ pontosTotais│    │ clienteId   │    │ icone       │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 📱 QR Code e Acesso pelo Celular

O sistema gera QR Codes que apontam automaticamente para o IP da rede local, permitindo que clientes escaneiem com o celular na mesma rede Wi-Fi.

### Como funciona

1. O **admin cria um pedido** → sistema gera QR Code + ticket automaticamente
2. O **QR Code contém uma URL** como `http://192.168.x.x:3000/rastreio/[id]`
3. O **cliente escaneia pelo celular** → vê o status, produtos e trilha do pedido
4. Se logado, pode **resgatar os pontos** diretamente na página

> O IP da rede é detectado automaticamente pelo servidor, ignorando adaptadores virtuais (Hyper-V, WSL, Docker).

---

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (0.0.0.0:3000) |
| `npm run build` | Gera o build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:push` | Aplica o schema no banco de dados |
| `npm run db:studio` | Abre o Prisma Studio (interface visual do banco) |
| `npm run db:seed` | Popula o banco com dados iniciais |

---

## 🧪 Dados Iniciais (Seed)

Ao executar `npm run db:seed`, o sistema cria:

| Dado | Detalhes |
|---|---|
| **Admin** | `admin@sharkleaf.com` / `admin123` |
| **Produtor** | Viveiro SharkLeaf — Tubarão/SC |
| **Produtos** | Muda de Eucalipto (R$ 2,50), Muda de Pinus (R$ 3,00), Muda de Acácia (R$ 4,00) |
| **Canteiros** | Canteiro Norte (5.000), Canteiro Sul (3.000), Estufa A (2.000) |
| **Estoque** | Distribuição inicial entre canteiros |
| **Medalhas** | 5 medalhas (Primeiro Pedido, Feedback Master, Rastreador, Cliente Fiel, Brinde Resgatado) |

---

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) para fins acadêmicos.

© 2026 — Diego Formentin & Fernando Sousa — IFSC Campus Tubarão
