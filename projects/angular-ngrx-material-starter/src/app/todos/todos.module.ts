import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared/shared.module';
import { environment } from '../../environments/environment';

import { FEATURE_NAME, reducers } from './todos.state';
import { TodosRoutingModule } from './todos-routing.module';
import { TodosContainerComponent } from './components/todos-container.component';
import { TodosEffects } from './todos.effects';
import { SettingsEffects } from '../settings/settings.effects';
import { TodosService } from './todos.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    LazyElementsModule,
    SharedModule,
    TodosRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([TodosEffects, SettingsEffects]),
    MatToolbarModule,
    DragDropModule,
    MatExpansionModule
  ],
  declarations: [TodosContainerComponent],
  providers: [TodosService]
})
export class TodosModule {
  constructor() {}
}
