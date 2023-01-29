import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-specialization-list',
  templateUrl: './specialization-list.component.html',
  styleUrls: ['./specialization-list.component.scss'],
})
export class SpecializationListComponent {
  searchQuery?: string;
}
