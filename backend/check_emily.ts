import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const candidates = await prisma.candidates.findMany({
    where: { full_name: { contains: 'Emily' } },
    include: { applications: { include: { job_opening: { include: { company: true } } } } }
  });
  console.log(JSON.stringify(candidates, null, 2));
}

main().finally(() => prisma.$disconnect());
