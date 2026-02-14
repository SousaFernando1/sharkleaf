import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

function createPrismaClient(): PrismaClient {
  // Se TURSO_DATABASE_URL estiver configurada, usa Turso
  if (process.env.TURSO_DATABASE_URL) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter } as any);
  }
  // Caso contrário, usa SQLite local
  return new PrismaClient();
}

const prisma = createPrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ==========================================
  // 1. Criar usuário admin
  // ==========================================
  const senhaAdmin = await bcrypt.hash("admin123", 10);
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@sharkleaf.com" },
    update: {},
    create: {
      email: "admin@sharkleaf.com",
      senha: senhaAdmin,
      tipo: "ADMIN",
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // ==========================================
  // 2. Criar produtor
  // ==========================================
  const produtor = await prisma.produtor.upsert({
    where: { email: "produtor@sharkleaf.com" },
    update: {},
    create: {
      nome: "Viveiro SharkLeaf",
      email: "produtor@sharkleaf.com",
      telefone: "(48) 99999-0000",
      endereco: "Rodovia BR-101, Tubarão - SC",
      descricao:
        "Viveiro especializado em produção de mudas de Eucalipto e espécies nativas. Comprometidos com a qualidade e sustentabilidade.",
    },
  });
  console.log("✅ Produtor criado:", produtor.nome);

  // ==========================================
  // 3. Criar medalhas
  // ==========================================
  const medalhas = [
    {
      nome: "Primeiro Pedido",
      descricao: "Resgatou pontos do primeiro pedido",
      icone: "🏆",
      condicao: "PRIMEIRO_PEDIDO",
    },
    {
      nome: "Feedback Master",
      descricao: "Deixou feedback em 5 pedidos",
      icone: "💬",
      condicao: "FEEDBACK_5",
    },
    {
      nome: "Rastreador",
      descricao: "Escaneou 10 QR Codes diferentes",
      icone: "🔍",
      condicao: "RASTREADOR_10",
    },
    {
      nome: "Cliente Fiel",
      descricao: "10 pedidos concluídos",
      icone: "⭐",
      condicao: "CLIENTE_FIEL_10",
    },
    {
      nome: "Brinde Resgatado",
      descricao: "Utilizou o primeiro brinde",
      icone: "🎁",
      condicao: "BRINDE_RESGATADO",
    },
  ];

  // Limpar medalhas existentes para evitar duplicatas
  await prisma.medalha.deleteMany();
  for (const medalha of medalhas) {
    await prisma.medalha.create({ data: medalha });
  }
  console.log("✅ Medalhas criadas:", medalhas.length);

  // ==========================================
  // 4. Criar produtos de exemplo
  // ==========================================
  const eucalipto = await prisma.produto.create({
    data: {
      nome: "Muda de Eucalipto",
      categoria: "Eucalipto",
      descricao: "Muda de Eucalipto Grandis de alta qualidade",
      precoUnitario: 2.5,
    },
  });

  const pinus = await prisma.produto.create({
    data: {
      nome: "Muda de Pinus",
      categoria: "Pinus",
      descricao: "Muda de Pinus Elliottii para reflorestamento",
      precoUnitario: 3.0,
    },
  });

  const acacia = await prisma.produto.create({
    data: {
      nome: "Muda de Acácia",
      categoria: "Nativas",
      descricao: "Muda de Acácia Negra para diversas finalidades",
      precoUnitario: 4.0,
    },
  });
  console.log("✅ Produtos criados: Eucalipto, Pinus, Acácia");

  // ==========================================
  // 5. Criar viveiros de exemplo
  // ==========================================
  const viveiroNorte = await prisma.canteiro.create({
    data: { nome: "Viveiro Norte", capacidade: 5000 },
  });

  const viveiroSul = await prisma.canteiro.create({
    data: { nome: "Viveiro Sul", capacidade: 3000 },
  });

  const estufa = await prisma.canteiro.create({
    data: { nome: "Estufa A", capacidade: 2000 },
  });
  console.log("✅ Viveiros criados: Norte, Sul, Estufa A");

  // ==========================================
  // 6. Criar estoque inicial
  // ==========================================
  await prisma.estoqueCanteiro.createMany({
    data: [
      {
        produtoId: eucalipto.id,
        canteiroId: viveiroNorte.id,
        quantidade: 2000,
      },
      {
        produtoId: eucalipto.id,
        canteiroId: viveiroSul.id,
        quantidade: 1500,
      },
      {
        produtoId: pinus.id,
        canteiroId: viveiroNorte.id,
        quantidade: 1000,
      },
      {
        produtoId: pinus.id,
        canteiroId: estufa.id,
        quantidade: 800,
      },
      {
        produtoId: acacia.id,
        canteiroId: viveiroSul.id,
        quantidade: 500,
      },
      {
        produtoId: acacia.id,
        canteiroId: estufa.id,
        quantidade: 300,
      },
    ],
  });
  console.log("✅ Estoque inicial criado");

  console.log("\n🎉 Seed finalizado com sucesso!");
  console.log("📧 Login admin: admin@sharkleaf.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

