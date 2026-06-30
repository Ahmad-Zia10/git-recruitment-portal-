import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const candidate = await prisma.candidates.findFirst({
    where: { full_name: 'Emily Clarke' },
    select: { status: true, current_company: true }
  });
  console.log("Candidate Status:", candidate);
}

main().finally(() => prisma.$disconnect());
