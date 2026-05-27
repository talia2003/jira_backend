export type DefaultColumnTemplate = {
  title: string
  position: number
}

export const DEFAULT_COLUMN_TEMPLATES: DefaultColumnTemplate[] = [
  { title: 'To Do', position: 0 },
  { title: 'In Progress', position: 1 },
  { title: 'Review', position: 2 },
  { title: 'Done', position: 3 },
]

