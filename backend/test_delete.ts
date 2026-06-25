import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const id = "1119e25c-cf2c-4b6a-b5b0-7127397ca26f";
  try {
    const res = await prisma.companies.delete({ where: { id } });
    console.log("Deleted successfully:", res);
  } catch (e) {
    console.error("Delete failed:", e);
  }
}

main().finally(() => prisma.$disconnect());
