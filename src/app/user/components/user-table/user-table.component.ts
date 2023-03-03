import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { UserPageableResponse } from '../../domain/user-pageable-response';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
  @Input() pageSize?: number;
  @Input() pageNumber?: number;
  @Output() dataUpdated = new EventEmitter<UserPageableResponse>();
  displayedColumns: string[] = ['username', 'roles'];
  isLoading = true;
  dataSource: User[] = [];

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.search();
  }

  search(searchQuery?: string) {
    this.isLoading = true;
    this.dataSource = [];
    this._userService
      .search(searchQuery || '', this.pageSize, this.pageNumber)
      .subscribe(response => {
        this.dataSource = response.content;
        this.isLoading = false;
        this.dataUpdated.emit(response);
      });
  }

  getTableCellStyle() {
    return {
      opacity: this.isLoading ? '0' : '1',
      visibility: this.isLoading ? 'hidden' : 'visible',
      transition: 'opacity 0.1s linear',
    };
  }
}
