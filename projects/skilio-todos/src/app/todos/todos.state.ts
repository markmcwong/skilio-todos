import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { todosReducer } from './todos.reducer';
import { TodosState } from './todos.model';

export const FEATURE_NAME = 'todos';
export const selectExamples = createFeatureSelector<State, State>(FEATURE_NAME);
export const reducers: ActionReducerMap<State> = {
  todos: todosReducer
};

export interface State {
  todos: TodosState;
}
