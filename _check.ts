import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const u = await prisma.usuario.findUnique({ where: { email: "admin@sharkleaf.com" } });
  console.log("User:", JSON.stringify(u, null, 2));
  if (u) {
    const valid = await bcrypt.compare("admin123", u.senha);
    console.log("Password valid:", valid);
  }
  await prisma.$disconnect();
}

main();

