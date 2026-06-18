import { prisma } from '../../config/prisma'

export async function getDashboardAggregates() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalActiveOpenings,
    totalCandidates,
    applicationsThisMonth,
    totalPlaced,
    openingsByPriority,
    applicationsByStatus,
    recentApplications,
    totalClients,
    billingSummaryAggregate,
  ] = await Promise.all([
    // Total active openings
    prisma.job_openings.count({
      where: { status: 'open' },
    }),

    // Total active candidates
    prisma.candidates.count({
      where: { status: 'active' },
    }),

    // Applications created this month
    prisma.applications.count({
      where: { applied_at: { gte: startOfMonth } },
    }),

    // Total placed
    prisma.applications.count({
      where: { status: 'placed' },
    }),

    // Openings grouped by priority
    prisma.job_openings.groupBy({
      by: ['priority'],
      where: { status: 'open' },
      _count: { id: true },
    }),

    // Applications grouped by status
    prisma.applications.groupBy({
      by: ['status'],
      _count: { id: true },
    }),

    // Recent 5 applications
    prisma.applications.findMany({
      take: 5,
      orderBy: { applied_at: 'desc' },
      select: {
        id: true,
        status: true,
        match_score: true,
        applied_at: true,
        candidate: {
          select: { id: true, full_name: true, current_role: true },
        },
        job_opening: {
          select: {
            id: true,
            role: { select: { title: true } },
            company: { select: { name: true } },
          },
        },
      },
    }),

    // Total clients count
    prisma.companies.count(),

    // Monthly billing sum (sum of bill_to_customer_gbp_monthly)
    prisma.billing_records.aggregate({
      _sum: {
        bill_to_customer_gbp_monthly: true,
      },
    }),
  ])

  const billingSum = Number(billingSummaryAggregate._sum.bill_to_customer_gbp_monthly || 0)

  return {
    summary: {
      total_active_openings: totalActiveOpenings,
      total_candidates: totalCandidates,
      applications_this_month: applicationsThisMonth,
      total_placed: totalPlaced,
      total_clients: totalClients,
      billing_summary: billingSum,
    },
    openings_by_priority: openingsByPriority.reduce(
      (acc, item) => {
        acc[item.priority] = item._count.id
        return acc
      },
      {} as Record<string, number>
    ),
    applications_by_status: applicationsByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id
        return acc
      },
      {} as Record<string, number>
    ),
    recent_applications: recentApplications,
  }
}