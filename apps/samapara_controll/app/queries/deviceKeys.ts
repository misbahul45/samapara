export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: () => [...deviceKeys.lists()] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
  forecasts: (id: string) => [...deviceKeys.detail(id), 'forecasts'] as const
}
