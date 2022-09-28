import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  exports: [
    PageNotFoundComponent
  ],
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ErrorPagesModule { }