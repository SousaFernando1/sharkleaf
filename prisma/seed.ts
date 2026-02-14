import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  let prisma: PrismaClient;

  // Se TURSO_DATABASE_URL estiver configurada, usa Turso
  if (process.env.TURSO_DATABASE_URL) {
    const libsqlModule = await import("@libsql/client");
    const adapterModule = await import("@prisma/adapter-libsql");
    const libsql = libsqlModule.createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new adapterModule.PrismaLibSQL(libsql);
    prisma = new PrismaClient({ adapter } as any);
    console.log("📡 Conectado ao Turso");
  } else {
    prisma = new PrismaClient();
    console.log("💾 Conectado ao SQLite local");
  }

  console.log("🌱 Iniciando seed...");

  // ==========================================
  // 1. Criar usuário admin
  // ==========================================
  const senhaAdmin = await bcrypt.hash("admin123", 10);
  const admin = await prisma.usuario.create({
    data: {
      email: "admin@sharkleaf.com",
      senha: senhaAdmin,
      tipo: "ADMIN",
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // ==========================================
  // 2. Criar produtor
  // ==========================================
  const produtor = await prisma.produtor.create({
    data: {
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
  const viveiroNorte = await prisma.viveiro.create({
    data: { nome: "Viveiro Norte", capacidade: 5000 },
  });

  const viveiroSul = await prisma.viveiro.create({
    data: { nome: "Viveiro Sul", capacidade: 3000 },
  });

  const estufa = await prisma.viveiro.create({
    data: { nome: "Estufa A", capacidade: 2000 },
  });
  console.log("✅ Viveiros criados: Norte, Sul, Estufa A");

  // ==========================================
  // 6. Criar estoque inicial
  // ==========================================
  const estoquesIniciais = [
    { produtoId: eucalipto.id, viveiroId: viveiroNorte.id, quantidade: 2000 },
    { produtoId: eucalipto.id, viveiroId: viveiroSul.id, quantidade: 1500 },
    { produtoId: pinus.id, viveiroId: viveiroNorte.id, quantidade: 1000 },
    { produtoId: pinus.id, viveiroId: estufa.id, quantidade: 800 },
    { produtoId: acacia.id, viveiroId: viveiroSul.id, quantidade: 500 },
    { produtoId: acacia.id, viveiroId: estufa.id, quantidade: 300 },
  ];

  for (const estoque of estoquesIniciais) {
    await prisma.estoqueViveiro.create({ data: estoque });
  }
  console.log("✅ Estoque inicial criado");

  console.log("\n🎉 Seed finalizado com sucesso!");
  console.log("📧 Login admin: admin@sharkleaf.com / admin123");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro no seed:", e);
  process.exit(1);
});
