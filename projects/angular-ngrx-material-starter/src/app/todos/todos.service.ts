import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Todo } from './todos.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TodosService {
  todosRef: AngularFirestoreCollection<Todo> = null;
  private dbPath = '/todos';

  constructor(private firestore: AngularFirestore) {
    this.todosRef = firestore.collection(this.dbPath);
  }

  addTodo(name: string, imgUrl: string, timestamp: number) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('todos')
        .add({ name, done: false, imgUrl, timestamp })
        .then(
          (res) => {},
          (err) => reject(err)
        );
    });
  }

  toggleTodo(id: string, done: boolean): Promise<void> {
    return this.todosRef.doc(id).update({ done: done });
  }

  getTodos(): Observable<Todo[]> {
    return this.todosRef
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data()
          }))
        )
      );
  }

  updateTodo(id: string, name: string): Promise<void> {
    return this.todosRef.doc(id).update({ name: name });
  }

  removeTodo(id: string): Promise<void> {
    return this.todosRef.doc(id).delete();
  }
}
