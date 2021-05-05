import { v4 as uuid } from 'uuid';
import { createReducer, on, Action } from '@ngrx/store';
import * as todoAction from './todos.actions';
import { Todo, TodosState } from './todos.model';

export const initialState: TodosState = {
  items: [],
  filter: 'ALL',
  editing: null
};

const reducer = createReducer(
  initialState,
  on(todoAction.actionTodosAdd, (state, todo) => ({
    ...state,
    items: [
      {
        id: null,
        name: todo.name,
        done: false,
        timestamp: todo.timestamp
      },
      ...state.items
    ]
  })),

  on(todoAction.actionTodosGetSuccess, (state, todos) => ({
    ...state,
    items: todos.todos
  })),

  on(todoAction.actionTodosSortedSuccess, (state, todos) => ({
    ...state,
    items: todos.todos
  })),

  on(todoAction.actionTodosEdit, (state, todo) => ({
    ...state,
    editing: state.items.filter((item: Todo) => item.id === todo.id)[0]
  })),

  on(todoAction.actionTodosEditingValue, (state, todo) => ({
    ...state,
    editing: { ...state.editing, todo }
  })),

  on(todoAction.actionTodosEditSubmit, (state, todo) => ({
    ...state,
    editing: null,
    items: state.items.map((item: Todo) =>
      item.id === todo.id ? { ...item, ...todo } : item
    )
  })),

  on(todoAction.actionTodosRemove, (state, todo) => ({
    ...state,
    items: state.items.filter((item: Todo) => item.id !== todo.id)
  })),

  on(todoAction.actionTodosToggle, (state, todo) => ({
    ...state,
    items: state.items.map((item: Todo) =>
      item.id === todo.id ? { ...item, done: !item.done } : item
    )
  })),
  on(todoAction.actionTodosRemoveDone, (state, todo) => ({
    ...state,
    items: state.items.filter((item: Todo) => !item.done)
  })),
  on(todoAction.actionTodosFilter, (state, todo) => ({
    ...state,
    filter: todo.filter
  }))
);

export function todosReducer(
  state: TodosState | undefined,
  action: Action
): TodosState {
  return reducer(state, action);
}
