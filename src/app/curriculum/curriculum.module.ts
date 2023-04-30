import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumTableComponent } from './components/curriculum-table/curriculum-table.component';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { CurriculumFormComponent } from './components/curriculum-form/curriculum-form.component';
import { SharedModule } from '../shared/shared.module';
import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CurriculumService } from './services/curriculum.service';

@NgModule({
  declarations: [
    CurriculumTableComponent,
    CurriculumListComponent,
    CurriculumFormComponent,
  ],
  imports: [CommonModule, SharedModule, CurriculumRoutingModule],
  providers: [CurriculumService],
})
export class CurriculumModule {}
