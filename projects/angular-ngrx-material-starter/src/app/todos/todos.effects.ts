import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { LocalStorageService } from '../core/core.module';

import { State } from './todos.state';
import * as todoAction from './todos.actions';
import { selectTodos, selectTodosState } from './todos.selectors';
import { TodosService } from './todos.service';
import { actionTodosGetError, actionTodosGetSuccess } from './todos.actions';
import { of } from 'rxjs';

export const TODOS_KEY = 'EXAMPLES.TODOS';

@Injectable()
export class TodosEffects {
  persistTodos = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          todoAction.actionTodosAdd,
          todoAction.actionTodosGet,
          todoAction.actionTodosFilter,
          todoAction.actionTodosEditSubmit,
          todoAction.actionTodosRemove,
          todoAction.actionTodosRemoveDone,
          todoAction.actionTodosToggle
        ),
        withLatestFrom(this.store.pipe(select(selectTodosState))),
        tap(([action, todos]) =>
          this.localStorageService.setItem(TODOS_KEY, todos)
        )
      ),
    { dispatch: false }
  );

  addTodo = createEffect(
    () => ({ debounce = 500 } = {}) =>
      this.actions$.pipe(
        ofType(todoAction.actionTodosAdd),
        withLatestFrom(this.store.pipe(select(selectTodos))),
        // debounceTime(debounce),
        switchMap(([action]) =>
          this.service.addTodo(action.name, action.imgUrl, action.timestamp)
        )
      ),
    { dispatch: false }
  );

  getTodos = createEffect(() => ({ debounce = 500 } = {}) =>
    this.actions$.pipe(
      ofType(todoAction.actionTodosGet),
      withLatestFrom(this.store.pipe(select(selectTodosState))),
      debounceTime(debounce),
      switchMap(([action]) =>
        this.service.getTodos().pipe(
          map((todos) =>
            actionTodosGetSuccess({
              todos: todos.sort((a, b) =>
                a.timestamp > b.timestamp
                  ? 1
                  : b.timestamp > a.timestamp
                  ? -1
                  : 0
              )
            })
          ),
          catchError((error) => of(actionTodosGetError({ error })))
        )
      )
    )
  );

  toggleTodo = createEffect(
    () => ({ debounce = 500 } = {}) =>
      this.actions$.pipe(
        ofType(todoAction.actionTodosToggle),
        withLatestFrom(this.store.pipe(select(selectTodosState))),
        debounceTime(debounce),
        switchMap(([action]) => this.service.toggleTodo(action.id, action.done))
      ),
    { dispatch: false }
  );

  editTodo = createEffect(
    () => ({ debounce = 500 } = {}) =>
      this.actions$.pipe(
        ofType(todoAction.actionTodosEditSubmit),
        withLatestFrom(this.store.pipe(select(selectTodosState))),
        debounceTime(debounce),
        switchMap(([action]) => this.service.updateTodo(action.id, action.name))
      ),
    { dispatch: false }
  );

  deleteTodo = createEffect(
    () => ({ debounce = 500 } = {}) =>
      this.actions$.pipe(
        ofType(todoAction.actionTodosRemove),
        withLatestFrom(this.store.pipe(select(selectTodosState))),
        debounceTime(debounce),
        switchMap(([action]) => this.service.removeTodo(action.id))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService,
    private service: TodosService
  ) {}
}
