import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';

import * as todoActions from '../todos.actions';
import { Todo, TodosFilter } from '../todos.model';
import { TodosContainerComponent } from './todos-container.component';
import {
  selectRemoveDoneTodosDisabled,
  selectTodos,
  selectTodosFilter
} from '../todos.selectors';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule
} from '@angular/fire/firestore';
import { environment } from '../../../environments/environment.test';

describe('TodosComponent', () => {
  let store: MockStore;
  let component: TodosContainerComponent;
  let fixture: ComponentFixture<TodosContainerComponent>;
  let dispatchSpy: jasmine.Spy;
  let mockSelectTodos: MemoizedSelector<any, Todo[]>;
  let mockSelectTodosFilter: MemoizedSelector<any, TodosFilter>;
  let mockSelectRemoveDoneTodosDisabled: MemoizedSelector<any, boolean>;
  let loader: HarnessLoader;
  let storage: AngularFireStorage;

  const getOpenFilterButton = () =>
    loader.getHarness(MatButtonHarness.with({ selector: '.todos-filter' }));

  const getFilterActiveButton = async () => {
    const menu = await loader.getHarness(MatMenuHarness);
    const items = await menu.getItems();
    return items[2];
  };

  const getTodoInput = () =>
    fixture.debugElement.query(By.css('anms-big-input input'));

  const getTodoItems = () =>
    fixture.debugElement.queryAll(By.css('.todo-label'));

  const getTodoItem = () => fixture.debugElement.query(By.css('.todo-label'));

  const getAddTodoButton = async () => {
    const buttons = await loader.getAllHarnesses(
      MatButtonHarness.with({ selector: 'anms-big-input-action button' })
    );
    return buttons[0];
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [TodosContainerComponent],
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    mockSelectTodos = store.overrideSelector(selectTodos, []);
    mockSelectTodosFilter = store.overrideSelector(selectTodosFilter, 'ACTIVE');
    mockSelectRemoveDoneTodosDisabled = store.overrideSelector(
      selectRemoveDoneTodosDisabled,
      true
    );
    fixture = TestBed.createComponent(TodosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should be created with 0 todos', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getTodoItems().length).toBe(0);
  });

  it('should display todos', () => {
    mockSelectTodos.setResult([
      { id: '1', name: 'test', done: false, timestamp: 0 }
    ]);
    store.refreshState();
    fixture.detectChanges();

    expect(getTodoItems().length).toBe(1);
    expect(getTodoItems()[0].nativeElement.textContent.trim()).toBe('test');
  });

  it('should dispatch add todo action', async () => {
    fixture.detectChanges();
    dispatchSpy.calls.reset();

    const keyUpEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: false
    });

    getTodoInput().nativeElement.value = 'hello world';
    getTodoInput().nativeElement.dispatchEvent(keyUpEvent);
    fixture.detectChanges();

    const addTodoButton = await getAddTodoButton();
    await addTodoButton.click();

    expect(getTodoInput().nativeElement.value).toBe('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.calls.mostRecent().args[0].name).toBe('hello world');
  });

  it('should dispatch filter todo action', async () => {
    dispatchSpy.calls.reset();

    const openFilterButton = await getOpenFilterButton();
    await openFilterButton.click();

    const filterActiveButton = await getFilterActiveButton();
    await filterActiveButton.click();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      todoActions.actionTodosFilter({ filter: 'ACTIVE' })
    );
  });

  it('should disable add new todo button if input length is less than 3', async () => {
    fixture.detectChanges();

    const keyUpEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: false
    });

    getTodoInput().nativeElement.value = 'ad';
    getTodoInput().nativeElement.dispatchEvent(keyUpEvent);
    fixture.detectChanges();
    const addTodoButton = await getAddTodoButton();
    let addTodoButtonIsDisabled = await addTodoButton.isDisabled();

    expect(addTodoButtonIsDisabled).toBe(true);

    getTodoInput().nativeElement.value = 'long enough';
    getTodoInput().nativeElement.dispatchEvent(keyUpEvent);
    fixture.detectChanges();

    addTodoButtonIsDisabled = await addTodoButton.isDisabled();
    expect(addTodoButtonIsDisabled).toBe(false);
  });

  it('should clear new todo input value on ESC key press', () => {
    fixture.detectChanges();

    const keyUpEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      shiftKey: false
    });

    getTodoInput().nativeElement.value = 'hello world';
    getTodoInput().nativeElement.dispatchEvent(keyUpEvent);
    fixture.detectChanges();

    const escKeypUp = new KeyboardEvent('keyup', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
      shiftKey: false
    });
    getTodoInput().nativeElement.dispatchEvent(escKeypUp);
    fixture.detectChanges();

    expect(getTodoInput().nativeElement.value).toBe('');
  });
});
