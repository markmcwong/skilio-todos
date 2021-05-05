import { v4 as uuid } from 'uuid';
import { createAction, props } from '@ngrx/store';

import { Todo, TodosFilter } from './todos.model';
import { HttpErrorResponse } from '@angular/common/http';

export const actionTodosAdd = createAction(
  '[Todos] Add',
  (name: string, imgUrl: string, timestamp: number) => ({
    name,
    imgUrl,
    timestamp
  })
);

export const actionTodosGet = createAction('[Todos] Get');

export const actionTodosGetSuccess = createAction(
  '[Todos] Get Success',
  props<{ todos: Todo[] }>()
);

export const actionTodosSortedSuccess = createAction(
  '[Todos] Get Success',
  props<{ todos: Todo[] }>()
);

export const actionTodosGetError = createAction(
  '[Todos] Get Error',
  props<{ error: HttpErrorResponse }>()
);

export const actionTodosToggle = createAction(
  '[Todos] Toggle',
  props<{ id: string; done: boolean }>()
);

export const actionTodosEdit = createAction(
  '[Todos] Edit',
  props<{ id: string }>()
);

export const actionTodosEditingValue = createAction(
  '[Todos] Editing',
  props<{ name: string }>()
);

export const actionTodosEditSubmit = createAction(
  '[Todos] Edit Submit',
  props<{ id: string; name: string }>()
);

export const actionTodosRemove = createAction(
  '[Todos] Remove',
  props<{ id: string }>()
);
export const actionTodosRemoveDone = createAction('[Todos] Remove Done');

export const actionTodosFilter = createAction(
  '[Todos] Filter',
  props<{ filter: TodosFilter }>()
);
