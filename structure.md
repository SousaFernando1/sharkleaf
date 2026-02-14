🌿 SharkLeaf: Sistema de Gestão e Gamificação para Viveiros
🎯 Objetivo do Protótipo (TCC)
Desenvolver uma solução tecnológica para o agronegócio, especificamente para produtores de mudas (ex: Eucalipto), que atualmente realizam controles via planilhas e papéis. O foco é a inovação através da união entre gestão interna de processos e uma experiência externa de fidelização focada no cliente final.

🛠️ Stack Tecnológica

## Frontend e Framework
- **Next.js 14+** (App Router) - Framework React com SSR/SSG
- **React 18+** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para maior segurança no código

## Estilização e UI
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **shadcn/ui** - Componentes UI pré-construídos e acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas (compatível com React Hook Form)
- **class-variance-authority** - Para variantes de componentes (usado pelo shadcn/ui)
- **tailwind-merge** - Merge de classes Tailwind (usado pelo shadcn/ui)

## Banco de Dados e ORM
- **Prisma ORM** - ORM para TypeScript/Node.js
- **SQLite** - Banco de dados (fácil portabilidade para TCC)
- **@prisma/client** - Cliente Prisma para queries

## Autenticação
- **NextAuth.js v4** - Autenticação completa para Next.js
- **bcryptjs** - Hash de senhas
- **@next-auth/prisma-adapter** - Adapter do Prisma para NextAuth v4

## Geração de QR Code e Tickets
- **qrcode** ou **qrcode.react** - Geração de QR Codes
- **nanoid** ou **cuid** - Geração de IDs únicos para tickets

## Integração com IA
- **OpenAI SDK** (`openai`) - Integração com GPT para enriquecer trilha do produto
- **fetch nativo** - Para requisições HTTP

## Validação e Formatação
- **Zod** - Validação de schemas e tipos
- **date-fns** - Manipulação e formatação de datas

## Utilitários
- **clsx** ou **class-variance-authority** - Gerenciamento de classes CSS condicionais
- **react-hot-toast** ou **sonner** - Notificações/toasts
- **zustand** ou **React Context** - Gerenciamento de estado global (se necessário)

## Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **@types/node** - Tipos TypeScript para Node.js

## Deploy e Produção (Opcional)
- **Vercel** - Hospedagem recomendada para Next.js
- **Railway** ou **Render** - Alternativas para deploy com banco de dados

## Bibliotecas Específicas por Funcionalidade

### Painel TV (Monitor)
- **SWR** ou **React Query** - Para polling automático a cada 60 segundos
- **useInterval** (hook customizado) - Para atualização periódica

### Geolocalização (Opcional)
- **navigator.geolocation** (API nativa do navegador)

### Geração de Relatórios (Futuro)
- **jspdf** - Geração de PDFs
- **xlsx** - Exportação para Excel

## 📦 Exemplo de package.json

```json
{
  "name": "sharkleaf",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    "next-auth": "^4.24.0",
    "@next-auth/prisma-adapter": "^1.0.7",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "qrcode": "^1.5.3",
    "qrcode.react": "^3.1.0",
    "nanoid": "^5.0.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "sonner": "^1.3.0",
    "openai": "^4.20.0",
    "swr": "^2.2.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/qrcode": "^1.5.5",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 🔧 Configurações Necessárias

### Variáveis de Ambiente (.env)
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui" # Gerar com: openssl rand -base64 32
OPENAI_API_KEY="sua-chave-openai"
```

### Prisma Schema
- Configurar provider como `sqlite`
- Definir todos os models conforme especificado no documento

### Next.js Config
- Configurar imagens (se necessário)
- Configurar rewrites/redirects para rotas

## ✅ Checklist de Inicialização do Projeto

### 1. Setup Inicial do Projeto
- [ ] Criar projeto Next.js com TypeScript: `npx create-next-app@latest sharkleaf --typescript --tailwind --app`
- [ ] Instalar dependências principais: Prisma, NextAuth, shadcn/ui, etc.
- [ ] Configurar ESLint e Prettier
- [ ] Criar arquivo `.env` com variáveis de ambiente

### 2. Configuração do Banco de Dados
- [ ] Inicializar Prisma: `npx prisma init`
- [ ] Criar schema Prisma com todos os models (conforme documentação)
- [ ] Configurar DATABASE_URL no `.env`
- [ ] Gerar Prisma Client: `npx prisma generate`
- [ ] Criar banco de dados: `npx prisma db push`
- [ ] (Opcional) Abrir Prisma Studio: `npx prisma studio`

### 3. Setup do shadcn/ui
- [ ] Inicializar shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Configurar `components.json`
- [ ] Instalar componentes necessários:
  - `npx shadcn-ui@latest add button`
  - `npx shadcn-ui@latest add input`
  - `npx shadcn-ui@latest add form`
  - `npx shadcn-ui@latest add card`
  - `npx shadcn-ui@latest add dialog`
  - `npx shadcn-ui@latest add dropdown-menu`
  - `npx shadcn-ui@latest add select`
  - `npx shadcn-ui@latest add toast`
  - `npx shadcn-ui@latest add table`
  - `npx shadcn-ui@latest add badge`
  - `npx shadcn-ui@latest add label`

### 4. Configuração de Autenticação
- [ ] Criar arquivo de configuração NextAuth: `app/api/auth/[...nextauth]/route.ts`
- [ ] Configurar Prisma Adapter
- [ ] Criar página de login
- [ ] Criar página de registro
- [ ] Implementar middleware de autenticação

### 5. Estrutura de Pastas
- [ ] Criar estrutura de rotas conforme documentação:
  - `app/(admin)/` - Área administrativa
  - `app/(cliente)/` - Portal do cliente
  - `app/(display)/` - Painel TV
- [ ] Criar pastas de componentes: `components/`, `components/ui/`
- [ ] Criar pastas de libs: `lib/`, `lib/utils.ts`
- [ ] Criar pastas de types: `types/`
- [ ] Criar pastas de hooks: `hooks/`

### 6. Configurações Essenciais
- [ ] Configurar `lib/utils.ts` com `cn()` para merge de classes
- [ ] Criar tipos TypeScript para models do Prisma
- [ ] Configurar API routes básicas
- [ ] Configurar tratamento de erros global

### 7. Funcionalidades Base
- [ ] Implementar layout base com navegação
- [ ] Criar componentes de UI reutilizáveis
- [ ] Implementar sistema de rotas protegidas
- [ ] Configurar tema/classe CSS base

### 8. Próximos Passos (Após Setup)
- [ ] Implementar CRUD de Canteiros
- [ ] Implementar CRUD de Produtos
- [ ] Implementar CRUD de Pedidos
- [ ] Implementar sistema de estoque
- [ ] Implementar geração de QR Code
- [ ] Implementar portal gamificado
- [ ] Implementar integração com OpenAI

📊 Regras de Negócio e Gamificação
1. Gestão de Canteiros e Estoque (CRUD)
Canteiros: Cadastro de áreas físicas de cultivo (ex: Canteiro Norte, Estufa A).

Estoque Setorial: O sistema deve permitir saber exatamente a quantidade de mudas de um produto em cada canteiro específico.

2. Fluxo de Pedidos e Rastreabilidade
Estrutura de Pedidos: Um pedido pode conter múltiplos produtos, e cada produto pode vir de múltiplos canteiros.

Criação de Pedido: O produtor adiciona produtos um por um. Para cada produto, escolhe de quais canteiros e quantas unidades tirar de cada canteiro.

Validação de Estoque: O sistema valida se a soma dos estoques dos canteiros escolhidos é suficiente para a quantidade solicitada.

Preço: Cada produto tem preço unitário definido no cadastro. O valor total do pedido é calculado automaticamente (soma de preço × quantidade de cada produto).

QR Code e Ticket: Gerados automaticamente na criação do pedido. Ambos são únicos por pedido (não por produto).

QR Code: URL única que leva para `/rastreio/[id]` ou `/rastreio/ticket/[ticket]` (mesma página).

Ticket: Código alfanumérico curto para acesso sem login.

Resgate de Pontos: Não há cliente pré-definido no pedido. O primeiro cliente que escanear o QR Code e resgatar os pontos (após login) recebe os pontos.

Pontos são calculados na criação: 1 ponto por unidade de produto.

Status Transparente: O cliente acompanha as etapas:

- RECEBIDO: Pedido criado, aguardando início da produção

- PRODUCAO: Mudas sendo preparadas

- EMPACOTAMENTO: Finalização para entrega

- PRONTO: Concluído na bancada, disponível para retirada (apenas neste status pode resgatar pontos)

- CANCELADO: Pedido cancelado (restaura estoque automaticamente para os mesmos canteiros de origem)

3. Sistema de Gamificação
Ganho de Pontos: 1 ponto por unidade de produto no pedido (calculado na criação do pedido).

Exemplo: Pedido com 10 mudas de Eucalipto + 5 mudas de Pinus = 15 pontos totais.

Brindes: A cada 100 pontos acumulados, o sistema gera automaticamente um Código de Brinde único.

O código é exibido no portal do cliente e pode ser usado uma vez (não expira).

O cliente informa o código ao produtor na hora de fazer um novo pedido.

O produtor digita o código no sistema e aplica um desconto em porcentagem (%) manualmente.

Se o pedido com código de brinde for cancelado, o código é reabilitado para o cliente.

O brinde físico é definido pelo produtor (Mudas, insumos, etc).

Títulos de Progressão:

🌱 Plantador Novato: 0 - 100 pontos.

🌿 Cultivador Engajado: 101 - 500 pontos.

🌳 Mestre Florestal: 501+ pontos.

Sistema de Medalhas: Conquistas adicionais baseadas em ações específicas (ex: Primeiro pedido, Feedback completo, etc).

4. Gestão de Estoque
Movimentações Automáticas: Ao criar pedido, reduz estoque dos canteiros escolhidos. Ao cancelar, restaura estoque para os mesmos canteiros de origem.

Validação: O sistema impede que o estoque fique negativo. Não permite deletar canteiro que possui estoque ou pedidos relacionados.

Ajustes Manuais: Entrada e saída de estoque por produto e canteiro.

Histórico: Visualização de todas as movimentações de estoque por produto, com data, tipo e responsável.

Regra de Capacidade: O sistema valida que não se pode adicionar mais estoque do que a capacidade do canteiro permite.

5. Rastreabilidade e Engajamento
Escaneamentos: Registrar cada escaneamento do QR Code (mesmo sem login).

Dados registrados:
- Nome do cliente (se logado) ou "Visitante"
- Localização (geolocalização opcional - se navegador permitir)
- Data e hora do escaneamento
- IP do dispositivo
- User Agent

Acesso sem Login: Cliente pode ver a trilha do produto e informações do pedido sem estar logado.

Resgate de Pontos: Apenas clientes logados podem resgatar pontos. Se tentar resgatar sem login, o sistema solicita login e permite resgatar na mesma página após autenticação.

Visualização pelo Produtor: Dashboard com todos os escaneamentos, permitindo análise de engajamento e origem dos clientes.

Trilha do Produto: Timeline visual mostrando o histórico completo do pedido desde a criação até a conclusão.

Integração com IA: Ao acessar a trilha, o sistema consulta uma API de IA (ex: OpenAI/Gemini) para buscar informações sobre o produto (nome científico, características, cuidados). Se a API falhar, exibe mensagem informando que não foi possível obter as informações adicionais.

6. Portal do Cliente (Área Logada)
Perfil do Usuário: Visualização e edição de dados básicos (nome, email, telefone, endereço).

Histórico de Pedidos: Lista completa de todos os pedidos do cliente, com status e detalhes.

Visualização de Pedidos: Acesso completo aos pedidos quando logado, incluindo trilha do produto e feedback.

Feedback: Cliente pode adicionar feedback apenas quando o pedido está com status PRONTO.

Códigos de Brinde: Visualização de todos os códigos de brinde gerados, indicando se já foram usados ou estão disponíveis.

Notificação de Uso: Quando um código de brinde é usado em um pedido, o cliente é notificado no portal.

Perfil do Produtor: Visualização de informações do produtor para contato (nome, telefone, endereço, descrição).

7. Área Administrativa
Dashboard: Métricas de engajamento (taxa de escaneamentos), taxa de resgate de pontos, pedidos em produção, produtos mais vendidos.

Painel TV (Monitor): Exibe apenas pedidos com status PRODUCAO e PRONTO, mostrando pedido, cliente e status. Atualização automática a cada 60 segundos.

Gestão de Produtos: CRUD completo de produtos com categorias, descrições e preço unitário.

Gestão de Clientes: Visualização de clientes cadastrados e seus pedidos.

Visualização de Escaneamentos: Lista de todos os escaneamentos de QR Codes com filtros por data, localização, cliente.

Agrupamento de Pedidos: Visualização de pedidos finalizados agrupados por cliente.

Código de Brinde em Pedidos: Campo para digitar código de brinde ao criar pedido. Sistema valida se o código existe e está ativo. Produtor aplica desconto em porcentagem (%) manualmente. Ao finalizar pedido, código é marcado como usado. Se pedido for cancelado, código é reabilitado.

Configurações: 
- Perfil do produtor (dados públicos: nome, telefone, endereço, descrição, logo)
- Configurações gerais do sistema

Validações: Sistema solicita confirmação antes de ações críticas (cancelar pedido, deletar produto/canteiro).

📂 Estrutura de Rotas
Plaintext
src/
├── app/
│   ├── (admin)/                
│   │   ├── dashboard/          # Insights: Taxa de engajamento e métricas
│   │   ├── pedidos/            # Gestão, troca de status, geração de QR e ticket
│   │   ├── pedidos/[id]/       # Detalhes do pedido e visualização de escaneamentos
│   │   ├── produtos/           # CRUD de Produtos
│   │   ├── clientes/           # Gestão de Clientes (visualizar pedidos)
│   │   ├── canteiros/          # CRUD de Canteiros
│   │   ├── estoque/            # Gestão de mudas global e por setor
│   │   └── config/             # Configurações (regras de pontuação, perfil produtor)
│   ├── (display)/              
│   │   └── monitor/            # Painel para TV (Refresh 60s) - Pedidos em produção
│   └── (cliente)/              
│       ├── rastreio/[id]/      # Timeline do pedido e Feedback (Sem login)
│       ├── rastreio/ticket/[ticket]/ # Acesso por ticket de pedido
│       └── portal/             # Área Logada: Saldo, Nível, Brindes, Medalhas e Histórico
💾 Modelo de Dados (Schema Prisma)
Snippet de código
model Canteiro {
  id          String            @id @default(cuid())
  nome        String
  capacidade  Int
  estoques    EstoqueCanteiro[]
  itensPedido ItemPedidoCanteiro[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Produto {
  id          String            @id @default(cuid())
  nome        String
  categoria   String?           
  descricao   String?
  precoUnitario Float           @default(0)  // Preço unitário do produto
  estoques    EstoqueCanteiro[]
  itensPedido ItemPedido[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model EstoqueCanteiro {
  id          String            @id @default(cuid())
  quantidade  Int               @default(0)
  produtoId   String
  canteiroId  String
  produto     Produto           @relation(fields: [produtoId], references: [id])
  canteiro    Canteiro          @relation(fields: [canteiroId], references: [id])
  movimentacoes MovimentacaoEstoque[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model MovimentacaoEstoque {
  id              String            @id @default(cuid())
  tipo            String            // ENTRADA, SAIDA
  quantidade      Int
  motivo          String?           // AJUSTE_MANUAL, PEDIDO, CANCELAMENTO
  estoqueId       String
  estoque         EstoqueCanteiro  @relation(fields: [estoqueId], references: [id])
  pedidoId        String?
  pedido          Pedido?           @relation(fields: [pedidoId], references: [id])
  createdAt       DateTime          @default(now())
}

model Pedido {
  id            String              @id @default(cuid())
  status        String              @default("RECEBIDO") // RECEBIDO, PRODUCAO, EMPACOTAMENTO, PRONTO, CANCELADO
  qrCode        String              @unique
  ticket        String              @unique              // Código do ticket para acesso sem login
  valorTotal    Float               @default(0)          // Valor total do pedido (soma de todos os itens)
  desconto      Float?              @default(0)          // Desconto em porcentagem (se houver código de brinde)
  codigoBrinde  String?                                   // Código de brinde usado no pedido
  pontosGerados Int                 @default(0)          // Total de pontos (1 ponto por unidade de produto)
  resgatado     Boolean             @default(false)
  clienteId     String?
  cliente       Cliente?            @relation(fields: [clienteId], references: [id])
  itens         ItemPedido[]
  comentarios   ComentarioPedido[]
  escaneamentos EscaneamentoQR[]
  movimentacoes MovimentacaoEstoque[]
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
}

model ItemPedido {
  id            String              @id @default(cuid())
  quantidade    Int                 // Quantidade total deste produto no pedido
  precoUnitario Float               // Preço unitário no momento da compra (snapshot)
  subtotal      Float               // quantidade * precoUnitario
  pedidoId      String
  pedido        Pedido              @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  produtoId     String
  produto       Produto             @relation(fields: [produtoId], references: [id])
  canteiros     ItemPedidoCanteiro[]
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
}

model ItemPedidoCanteiro {
  id            String              @id @default(cuid())
  quantidade    Int                 // Quantidade deste produto que vem deste canteiro
  itemPedidoId  String
  itemPedido    ItemPedido          @relation(fields: [itemPedidoId], references: [id], onDelete: Cascade)
  canteiroId    String
  canteiro      Canteiro            @relation(fields: [canteiroId], references: [id])
  createdAt     DateTime            @default(now())
}

model ComentarioPedido {
  id        String   @id @default(cuid())
  texto     String
  pedidoId  String
  pedido    Pedido   @relation(fields: [pedidoId], references: [id])
  clienteId String?
  cliente   Cliente? @relation(fields: [clienteId], references: [id])
  createdAt DateTime @default(now())
}

model EscaneamentoQR {
  id          String   @id @default(cuid())
  pedidoId    String
  pedido      Pedido   @relation(fields: [pedidoId], references: [id])
  clienteId   String?
  cliente     Cliente? @relation(fields: [clienteId], references: [id])
  nome        String?  // Nome do cliente ou "Visitante"
  localizacao String?  // Cidade/Estado ou coordenadas
  ip          String?
  userAgent   String?
  createdAt   DateTime @default(now())
}

model Cliente {
  id           String            @id @default(cuid())
  nome         String
  email        String            @unique
  telefone     String?
  endereco     String?
  pontosTotais Int               @default(0)
  brindes      Brinde[]
  pedidos      Pedido[]          // Pedidos onde o cliente resgatou pontos
  comentarios  ComentarioPedido[]
  escaneamentos EscaneamentoQR[]
  medalhas     MedalhaCliente[]
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
}

model Brinde {
  id        String   @id @default(cuid())
  codigo    String   @unique
  usado     Boolean  @default(false)
  usadoEm   DateTime?
  pedidoId  String?  // Pedido onde o código foi usado (null se não foi usado)
  clienteId String
  cliente   Cliente  @relation(fields: [clienteId], references: [id])
  createdAt DateTime @default(now())
}

model Medalha {
  id          String            @id @default(cuid())
  nome        String
  descricao   String
  icone       String?           // Nome do ícone ou emoji
  condicao    String            // Condição para ganhar (ex: "PRIMEIRO_PEDIDO", "FEEDBACK_COMPLETO")
  clientes    MedalhaCliente[]
  createdAt   DateTime          @default(now())
}

model MedalhaCliente {
  id        String   @id @default(cuid())
  clienteId String
  cliente   Cliente  @relation(fields: [clienteId], references: [id])
  medalhaId String
  medalha   Medalha  @relation(fields: [medalhaId], references: [id])
  createdAt DateTime @default(now())
}


model Produtor {
  id              String            @id @default(cuid())
  nome            String
  email           String            @unique
  telefone        String?
  endereco        String?
  descricao       String?           // Para exibir no perfil público
  logo            String?           // URL da logo
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model Usuario {
  id        String   @id @default(cuid())
  email     String   @unique
  senha     String   // Hash da senha
  tipo      String   // ADMIN, CLIENTE
  clienteId String?  @unique
  cliente   Cliente? @relation(fields: [clienteId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

📝 Observações Importantes

1. Fluxo de Resgate de Pontos
- Cliente pode escanear QR Code sem estar logado e ver a trilha do produto
- Para resgatar pontos, precisa estar logado
- Se tentar resgatar sem login, sistema solicita login e permite resgatar na mesma página após autenticação
- Apenas pedidos com status PRONTO permitem resgate de pontos
- O primeiro cliente que resgatar recebe os pontos (1 ponto por unidade de produto)
- Uma vez resgatado, o campo `resgatado` do pedido fica como `true` e ninguém mais pode resgatar
- Tentativas de resgate sem login não são registradas como resgate válido

2. Geração de QR Code e Ticket
- QR Code: URL única que leva para `/rastreio/[id]` onde `id` é o ID do pedido
- Ticket: Código alfanumérico curto (ex: "ABC123") para acesso sem login via `/rastreio/ticket/[ticket]`
- Ambos levam para a mesma página de rastreio
- Ambos devem ser gerados automaticamente na criação do pedido

3. Estrutura de Pedidos com Múltiplos Produtos
- Um pedido pode ter múltiplos produtos (ItemPedido)
- Cada produto pode vir de múltiplos canteiros (ItemPedidoCanteiro)
- O produtor escolhe manualmente quantas unidades tirar de cada canteiro
- O sistema valida se a soma dos estoques dos canteiros escolhidos é suficiente
- Pontos são calculados na criação: 1 ponto por unidade de produto
- Valor total = soma de (preço unitário × quantidade) de cada produto

4. Código de Brinde
- Gerado automaticamente quando cliente atinge 100 pontos
- Exibido no portal do cliente
- Cliente informa o código ao produtor na hora de fazer novo pedido
- Produtor digita código no sistema ao criar pedido
- Sistema valida se código existe e está ativo (não precisa validar se pertence ao cliente)
- Produtor aplica desconto em porcentagem (%) manualmente
- Ao finalizar pedido, código é marcado como usado (pedidoId preenchido)
- Se pedido for cancelado, código é reabilitado (pedidoId volta para null, usado = false)

5. Cancelamento de Pedido
- Restaura estoque automaticamente para os mesmos canteiros de origem
- Se código de brinde foi usado, reabilita o código
- Solicita confirmação antes de cancelar

6. Sistema de Medalhas (Sugestões)
- 🏆 Primeiro Pedido: Primeiro pedido resgatado
- 💬 Feedback Master: Deixou feedback em 5 pedidos
- 🔍 Rastreador: Escaneou 10 QR Codes diferentes
- ⭐ Cliente Fiel: 10 pedidos concluídos
- 🎁 Brinde Resgatado: Primeiro brinde utilizado

7. Validações Importantes
- Não permitir criar pedido se não houver estoque suficiente nos canteiros escolhidos
- Validar que estoque não pode ficar negativo
- Impedir deletar canteiro que possui estoque ou pedidos relacionados
- Impedir resgate de pontos se pedido não estiver com status PRONTO
- Validar que apenas um cliente pode resgatar pontos por pedido
- Solicitar confirmação antes de ações críticas (cancelar pedido, deletar produto/canteiro)

8. Integração com IA para Trilha do Produto
- Consulta feita on-demand quando cliente acessa a trilha
- Prompt padrão busca informações sobre o produto (nome científico, características, cuidados)
- Se API falhar, exibe mensagem informando que não foi possível obter informações
- Pode implementar cache para evitar muitas chamadas à API

9. Interface e Responsividade
- Sistema deve ser mobile-friendly (especialmente portal do cliente e rastreio)
- Área admin pode ser otimizada para desktop, mas deve funcionar em mobile

10. Autenticação
- Apenas um usuário admin principal
- Clientes fazem login/cadastro para acessar portal gamificado
- NextAuth.js ou similar para gerenciar autenticação