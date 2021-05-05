import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosContainerComponent } from './components/todos-container.component';

const routes: Routes = [
  {
    path: '',
    component: TodosContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      },
      {
        path: 'todos',
        component: TodosContainerComponent,
        data: { title: 'anms.examples.menu.todos' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule {}
