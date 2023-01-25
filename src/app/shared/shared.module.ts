import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FrameComponent } from './components/frame/frame.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

const modules = [
  CommonModule,
  RouterModule,
  BrowserAnimationsModule,
  FormsModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule,
  MatPaginatorModule,
  MatTreeModule,
  MatProgressBarModule,
  MatInputModule,
  MatExpansionModule,
];

const declarations = [ToolbarComponent, FrameComponent, PaginatorComponent];

@NgModule({
  declarations: [...declarations],
  exports: [...modules, declarations],
  imports: [...modules],
})
export class SharedModule {}
