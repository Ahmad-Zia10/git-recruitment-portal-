export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    aggregates: () => [...queryKeys.dashboard.all, 'aggregates'] as const,
  },
  clients: {
    all: ['clients'] as const,
    list: (search: string, page: number) =>
      [...queryKeys.clients.all, 'list', { search, page }] as const,
  },
  companies: {
    all: ['companies'] as const,
    activeList: () => [...queryKeys.companies.all, 'active-list'] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: () => [...queryKeys.roles.all, 'list'] as const,
  },
  jobOpenings: {
    all: ['jobOpenings'] as const,
    list: (filters: Record<string, string | number>) =>
      [...queryKeys.jobOpenings.all, 'list', filters] as const,
    openList: () => [...queryKeys.jobOpenings.all, 'open-list'] as const,
    detail: (id: string) => [...queryKeys.jobOpenings.all, 'detail', id] as const,
    suggested: (id: string) => [...queryKeys.jobOpenings.all, 'suggested', id] as const,
  },
  candidates: {
    all: ['candidates'] as const,
    list: (filters: { search: string; status: string; page: number }) =>
      [...queryKeys.candidates.all, 'list', filters] as const,
    activeList: () => [...queryKeys.candidates.all, 'active-list'] as const,
    detail: (id: string) => [...queryKeys.candidates.all, 'detail', id] as const,
  },
  applications: {
    all: ['applications'] as const,
    list: (filters: { status: string; page: number }) =>
      [...queryKeys.applications.all, 'list', filters] as const,
    placedList: () => [...queryKeys.applications.all, 'placed-list'] as const,
    detail: (id: string) => [...queryKeys.applications.all, 'detail', id] as const,
  },
  billing: {
    all: ['billing'] as const,
    list: (page: number) => [...queryKeys.billing.all, 'list', { page }] as const,
  },
} as const;
