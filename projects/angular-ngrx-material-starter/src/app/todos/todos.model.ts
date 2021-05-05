export interface Todo {
  id: string;
  name: string;
  done: boolean;
  imgUrl?: string;
  timestamp: number;
}

export type TodosFilter = 'ALL' | 'DONE' | 'ACTIVE';

export interface TodosState {
  items: Todo[];
  filter: TodosFilter;
  editing: Todo;
}
