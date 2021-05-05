import * as assert from 'assert';
import { Store } from '@ngrx/store';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { LocalStorageService } from '../core/core.module';

import { State } from './todos.state';
import { actionTodosToggle } from './todos.actions';
import { TodosEffects, TODOS_KEY } from './todos.effects';
import { TodosState } from './todos.model';
import { TodosService } from './todos.service';

const scheduler = new TestScheduler((actual, expected) =>
  assert.deepStrictEqual(actual, expected)
);

describe('TodosEffects', () => {
  let localStorage: jasmine.SpyObj<LocalStorageService>;
  let todoService: jasmine.SpyObj<TodosService>;
  let store: jasmine.SpyObj<Store<State>>;

  beforeEach(() => {
    localStorage = jasmine.createSpyObj('LocalStorageService', ['setItem']);
    store = jasmine.createSpyObj('store', ['pipe']);
    todoService = jasmine.createSpyObj('TodosService', ['getTodos']);
  });

  describe('persistTodos', () => {
    it('should not dispatch any action', () => {
      const actions$ = new Actions();
      const effect = new TodosEffects(
        actions$,
        store,
        localStorage,
        todoService
      );
      const metadata = getEffectsMetadata(effect);

      expect(metadata.persistTodos.dispatch).toEqual(false);
    });

    it('should call setItem on LocalStorageService for any action', () => {
      scheduler.run((helpers) => {
        const { cold } = helpers;

        const todosState: TodosState = {
          items: [{ id: '1', name: 'Test ToDo', done: false }],
          filter: 'ALL'
        };
        store.pipe.and.returnValue(of(todosState));
        const persistAction = actionTodosToggle({
          done: false,
          name: '',
          id: 'a'
        });
        const source = cold('a', { a: persistAction });
        const actions = new Actions(source);
        const effect = new TodosEffects(
          actions,
          store,
          localStorage,
          todoService
        );

        effect.persistTodos.subscribe(() => {
          expect(localStorage.setItem).toHaveBeenCalledWith(
            TODOS_KEY,
            todosState
          );
        });
      });
    });
  });
});
