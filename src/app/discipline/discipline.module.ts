import { NgModule } from '@angular/core';
import { DisciplineListComponent } from './components/discipline-list/discipline-list.component';
import { SharedModule } from '../shared/shared.module';
import { DisciplineTableComponent } from './components/discipline-table/discipline-table.component';
import { DisciplineFormComponent } from './components/discipline-form/discipline-form.component';
import { DisciplineRoutingModule } from './discipline-routing.module';
import { DisciplineService } from './services/discipline.service';

@NgModule({
  declarations: [
    DisciplineListComponent,
    DisciplineTableComponent,
    DisciplineFormComponent,
  ],
  imports: [SharedModule, DisciplineRoutingModule],
  providers: [DisciplineService],
})
export class DisciplineModule {}
