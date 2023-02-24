import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisciplineListComponent } from './components/discipline-list/discipline-list.component';
import { SharedModule } from '../shared/shared.module';
import { DisciplineTableComponent } from './components/discipline-table/discipline-table.component';
import { DisciplineFormComponent } from './components/discipline-form/discipline-form.component';

@NgModule({
  declarations: [
    DisciplineListComponent,
    DisciplineTableComponent,
    DisciplineFormComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class DisciplineModule {}
