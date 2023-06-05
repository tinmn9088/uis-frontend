import { Component, OnInit, ViewChild } from '@angular/core';
import { CurriculumTableComponent } from '../curriculum-table/curriculum-table.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurriculumPageableResponse } from '../../domain/curriculum-pageable-response';
import { PageEvent } from '@angular/material/paginator';
import { Permission } from 'src/app/auth/domain/permission';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.scss'],
})
export class CurriculumListComponent implements OnInit {
  @ViewChild(CurriculumTableComponent)
  curriculumTable!: CurriculumTableComponent;
  totalElements!: number;
  arePermissionsPresent: boolean;
  pageSize!: number;
  pageNumber!: number;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute
  ) {
    this.arePermissionsPresent = this._authService.hasUserPermissions([
      Permission.CURRICULUM_GET,
    ]);
  }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.pageNumber = data['pagination']?.page;
      this.pageSize = data['pagination']?.size;
    });
  }

  onDataUpdate(response: CurriculumPageableResponse) {
    this.totalElements = response.totalElements;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    setTimeout(() => this.curriculumTable.getAll());
  }

  onSortChange() {
    setTimeout(() => this.curriculumTable.getAll());
  }
}
