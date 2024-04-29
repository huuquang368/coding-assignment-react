export const backendURL = 'http://localhost:3333/api';

export const filterOptions: FilterOption[] = [
  { id: 1, value: 'all', text: 'All' },
  { id: 2, value: 'completed', text: 'Completed' },
  { id: 3, value: 'uncompleted', text: 'Uncompleted' },
];

export interface FilterOption {
  id: number;
  value: string;
  text: 'All' | 'Completed' | 'Uncompleted';
}
