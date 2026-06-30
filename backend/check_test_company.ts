import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const company = await prisma.companies.findFirst({
    where: { name: { contains: 'Test Company LLC' } },
    include: { job_openings: true }
  });
  console.log("Company:", JSON.stringify(company, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
