import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const company = await prisma.companies.create({
    data: { name: 'Delete Me Company', status: 'active' }
  });
  console.log("Created company:", company.id);

  const job = await prisma.job_openings.create({
    data: {
      company_id: company.id,
      role_id: (await prisma.roles.findFirst())!.id,
      status: 'open',
      min_exp_years: 1, max_exp_years: 3, budget_currency: 'USD',
      hiring_type: 'permanent', notice_period_buyback: false,
      no_of_positions: 1, location: 'Remote', work_mode: 'remote',
      priority: 'medium', created_by: (await prisma.users.findFirst())!.id
    }
  });
  console.log("Created job:", job.id);

  // Soft delete via service
  const { deleteCompany } = require('./src/modules/companies/companies.service.ts');
  const result = await deleteCompany(company.id);
  console.log("Delete result:", result);

  const updatedCompany = await prisma.companies.findUnique({ where: { id: company.id } });
  console.log("Updated status:", updatedCompany?.status);

  // Cleanup
  await prisma.job_openings.delete({ where: { id: job.id } });
  await prisma.companies.delete({ where: { id: company.id } });
}

main().finally(() => prisma.$disconnect());
