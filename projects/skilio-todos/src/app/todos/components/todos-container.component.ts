import { selectSelectedTodo, selectTodosFilter } from '../todos.selectors';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { finalize, map, startWith, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../core/core.module';

import * as todoActions from '../todos.actions';
import { Todo, TodosFilter } from '../todos.model';
import { selectTodos } from '../todos.selectors';

@Component({
  selector: 'anms-todos',
  templateUrl: './todos-container.component.html',
  styleUrls: ['./todos-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosContainerComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  todos$: Observable<Todo[]>;
  filter$: Observable<TodosFilter>;
  newTodo = '';
  editingValue = '';
  isEdit$: Observable<boolean>;
  selectedTodo$: Observable<Todo>;
  fileAttr = 'No File Chosen';
  imgUrl = '';

  constructor(
    public store: Store,
    public snackBar: MatSnackBar,
    public translateService: TranslateService,
    private notificationService: NotificationService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.store.dispatch(todoActions.actionTodosGet());
    this.todos$ = this.store.pipe(select(selectTodos));
    this.selectedTodo$ = this.store.pipe(select(selectSelectedTodo));
    this.filter$ = this.store.pipe(select(selectTodosFilter));
    // Checks if user has selected a todos to edit by checking null
    this.isEdit$ = this.store.pipe(
      select(selectSelectedTodo),
      map((editingSelectedTodo) => editingSelectedTodo != null)
    );
  }

  get isAddTodoDisabled() {
    return this.newTodo.length < 3;
  }

  onNewTodoChange(newTodo: string) {
    this.newTodo = newTodo;
  }

  onNewTodoClear() {
    this.newTodo = '';
  }

  onAddTodo() {
    this.store.dispatch(
      todoActions.actionTodosAdd(this.newTodo, this.imgUrl, Date.now())
    );
    const addedMessage = this.translateService.instant(
      'anms.examples.todos.added.notification',
      { name: this.newTodo }
    );
    this.notificationService.info(addedMessage);
    this.newTodo = '';
    this.imgUrl = '';
    this.fileAttr = 'No File Chosen';
  }

  onRemoveTodo(todo: Todo) {
    this.store.dispatch(todoActions.actionTodosRemove(todo));
  }

  onToggleTodo(todo: Todo) {
    this.store.dispatch(
      todoActions.actionTodosToggle({ ...todo, done: !todo.done })
    );
    const newStatus = this.translateService.instant(
      `anms.examples.todos.filter.${todo.done ? 'active' : 'done'}`
    );
    const undo = this.translateService.instant('anms.examples.todos.undo');
    const toggledMessage = this.translateService.instant(
      'anms.examples.todos.toggle.notification',
      { name: todo.name }
    );

    // show notification of the status of the todo
    this.snackBar
      .open(`${toggledMessage} ${newStatus}`, undo, {
        duration: 2500,
        panelClass: 'todos-notification-overlay'
      })
      .onAction()
      .pipe(take(1))
      .subscribe(() => this.onToggleTodo({ ...todo, done: !todo.done }));
  }

  onEditTodo(todo: Todo) {
    this.store.dispatch(todoActions.actionTodosEdit({ id: todo.id }));
  }

  onEditingTodoValue(value: string) {
    this.editingValue = value;
  }

  onEditTodoSubmit(todo: Todo) {
    this.store.dispatch(
      todoActions.actionTodosEditSubmit({
        id: todo.id,
        name: this.editingValue
      })
    );
  }

  onFilterTodos(filter: TodosFilter) {
    this.store.dispatch(todoActions.actionTodosFilter({ filter }));
    const filterToMessage = this.translateService.instant(
      'anms.examples.todos.filter.notification'
    );
    const filterMessage = this.translateService.instant(
      `anms.examples.todos.filter.${filter.toLowerCase()}`
    );
    this.notificationService.info(`${filterToMessage} ${filterMessage}`);
  }

  // drag and drop sorting not implemented therefore commented out
  // drop(event: CdkDragDrop<Todo[]>) {
  //   this.todos$.subscribe((todo) => {
  //     const tempTodos:Todo[] = [...todo];
  //     moveItemInArray(tempTodos, event.previousIndex, event.currentIndex);
  //     this.store.dispatch(todoActions.actionTodosSortedSuccess({ todos: tempTodos } ));
  //   });
  // }

  // upload file using firestore, then assign the url to imgUrl
  uploadFile(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = imgFile.target.files[0].name;
      const file = imgFile.target.files[0];
      const fileRef = this.storage.ref('/').child(this.fileAttr);
      const task = this.storage.upload(Date.now() + '-' + this.fileAttr, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((downloadURL) => {
              this.imgUrl = downloadURL;
            });
          })
        )
        .subscribe();

      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'No File Chosen';
    }
  }
}
